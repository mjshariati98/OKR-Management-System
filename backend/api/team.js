import dotenv from 'dotenv';
import express from 'express';
import { createNewTeam, getTeam, getAllTeams, getTeamMembers } from '../model/team.js';
import { getAllUsers, getUser } from '../model/user.js'
import auth from '../middleware/auth.js';

dotenv.config();
const router = express.Router();
export default router;

// Get all teams
router.get('/', auth, async (req, res) => {
    try {
        const teams = await getAllTeams();
        for (const team of teams) {
            const teamMembers = await getTeamMembers(team);
            team.setDataValue('members', teamMembers);
        }
        res.status(200).json(teams);
    }catch (err){
        res.status(500).send('Failed to get teams.');
        console.log(err);
    }
});

// Create new team
router.post('/new', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const { name, description, teamLeader, productManager } = req.body;

        // Check authority
        if (userRole != 'Admin') {
            return res.status(401).send('You dont have the permission to create a new team. Ask your admin.');   
        }

        // Validate user's input
        if (!name || !teamLeader) {
            return res.status(400).send('Team\'s name and TeamLeader fields are required');
        }

        // check if team already exist
        const oldTeam = await getTeam(name);
        if (oldTeam) {
            return res.status(409).send('Team Already Exist.');
        }

        // Check team leader exist
        const tl = await getUser(teamLeader);
        if (!tl) {
            return res.status(404).send('TeamLeader with this username does not exist');
        }

        // Check product manager exist
        var pm = null;
        if (productManager) {
            pm = await getUser(productManager);
            if (!pm) {
                return res.status(404).send('ProductManager with this username does not exist');
            }
        }
        
        // Create the team
        await createNewTeam(name, description, teamLeader, productManager)

        tl.role = 'TeamLeader'
        tl.teamName = name
        await tl.save()

        if (productManager) {
            pm.role = 'ProductManager'
            pm.teamName = name
            await pm.save()
        }

        res.status(201).json({
            message: 'Team Created successfully'
        });
    }catch (err){
        res.status(500).send('Failed to create the team.');
        console.log(err);
    }
});

// Update a team
router.put('/:team_name', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const teamName = req.params.team_name;
        const { description: newDescription, teamLeader:newTeamLeader, productManager:newProductManager } = req.body;

        // Check authority
        if (userRole != 'Admin') {
            return res.status(401).send('You dont have the permission to change the teams. Ask your admin.');
        }

        // Get the team
        const team = await getTeam(teamName);
        if (!team) {
            return res.status(409).send('Team with this name does not Exist.');
        }

        // Update description
        if (newDescription) {
            team.description = newDescription;
        }
        
        // update TL
        if (newTeamLeader) {
            const oldTL = await getUser(team.teamLeader);
            const newTL = await getUser(newTeamLeader);
            if (!newTL) {
                return res.status(404).send('TeamLeader with this username does not exist');
            }

            oldTL.role = 'Normal';
            newTL.role = 'TeamLeader';
            newTL.teamName = teamName
            team.teamLeader = newTeamLeader;
            
            await oldTL.save();
            await newTL.save();
        }

        // Update PM
        if (newProductManager) {
            const oldPM = await getUser(team.productManager);
            const newPM = await getUser(newProductManager);
            if (!newPM) {
                return res.status(404).send('ProductManager with this username does not exist');
            }

            oldPM.role = 'Normal';
            newPM.role = 'ProductManager';
            newPM.teamName = teamName
            team.productManager = newProductManager;
            
            await oldPM.save();
            await newPM.save();
        }

        await team.save();

        // Response
        res.status(200).send('Team updated succussfully!');
    } catch (error) {
        res.status(500).send('Failed to update the team.');
        console.log(error);
    }
});

// Delete a team
router.delete('/:team_name', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const teamName = req.params.team_name;

        // Check authority
        if (userRole != 'Admin') {
            return res.status(401).send('You dont have the permission to delete the teams. Ask your admin.');
        }
        
        // Get the team
        const team = await getTeam(teamName);
        if (!team) {
            return res.status(409).send('Team with this name does not Exist.');
        }

        // Set TL role to normal
        const teamTL = await getUser(team.teamLeader);
        if (teamTL) {
            teamTL.role = 'Normal';
            await teamTL.save();
        }

        // Set PM role to normal
        const teamPM = await getUser(team.productManager);
        if (teamPM) {
            teamPM.role = 'Normal';
            await teamPM.save();
        }

        // Unset teamName in team members
        const users = await getAllUsers();
        for (const user in users) {
            if (users[user].teamName == teamName) {
                users[user].teamName = null;
                await users[user].save();
            }
        }

        // Delete the team
        await team.destroy();

        // Response
        res.status(200).send('Team deleted succussfully!');
    } catch (error) {
        res.status(500).send('Failed to delete the team.');
        console.log(error);
    }
});

// Add a user to a team
router.post('/add_member/:team_name', auth, async (req, res) => {

try {
        const userRole = req.userRole;
        const teamName = req.params.team_name;
        const { username } = req.body;

        // Get the team
        const team = await getTeam(teamName);
        if (!team) {
            return res.status(409).send('Team with this name does not Exist.');
        }

        // Check authority
        if (userRole != 'Admin' && userRole != 'TeamLeader') {
            return res.status(401).send('You dont have the permission to add users to teams. Ask your admin or team leader.');
        }

        // Validate input
        if (!(username)) {
            res.status(400).send('Username is required');
        }

        // Check user exist
        const user = await getUser(username);
        if (!user) {
            return res.status(404).send('user with this username does not exist');
        }

        // Team leaders only can add normal users to team
        if (userRole == 'TeamLeader' && user.role != 'Normal') {
            return res.status(401).send('You dont have the permission to add non-Noraml users to teams. Ask your admin.');
        }

        // Team leaders only can add users to their own team
        if (userRole == 'TeamLeader') {
            const tl = await getUser(req.user)
            const tlTeam = tl.teamName
            if (tlTeam != teamName){
                return res.status(401).send('You dont have the permission to add users to another teams.');
            }
        }

        user.teamName = teamName
        user.role = 'Normal'
        user.save()

        res.status(201).json({
            message: 'User assigned to team successfully.'
        });
    }catch (err){
        res.status(500).send('Failed to assign user to team.');
        console.log(err);
    }
});

// Remove a user from a team
router.delete('/remove_member/:team_name', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const teamName = req.params.team_name;
        const { username } = req.body;

        // Get the team
        const team = await getTeam(teamName);
        if (!team) {
            return res.status(409).send('Team with this name does not Exist.');
        }

        // Check authority
        if (userRole != 'Admin' && userRole != 'TeamLeader') {
            return res.status(401).send('You dont have the permission to remove users from teams. Ask your admin or team leader.');
        }

        // Validate input
        if (!(username)) {
            res.status(400).send('Username is required');
        }

        // Check user exist
        const user = await getUser(username);
        if (!user) {
            return res.status(404).send('user with this username does not exist');
        }

        // Team leaders only can remove normal users to team
        if (userRole == 'TeamLeader' && user.role != 'Normal') {
            return res.status(401).send('You dont have the permission to remove non-Noraml users from teams. Ask your admin.');
        }

        // Team leaders only can remove users from their own team
        if (userRole == 'TeamLeader') {
            const tl = await getUser(req.user)
            const tlTeam = tl.teamName
            if (tlTeam != teamName){
                return res.status(401).send('You dont have the permission to remove users from another teams.');
            }
        }

        user.teamName = null
        user.role = 'Normal'
        user.save()

        res.status(201).json({
            message: 'User removed from team successfully.'
        });
    }catch (err){
        res.status(500).send('Failed to remove user from team.');
        console.log(err);
    }
});

// Get team members
router.get('/:team_name', auth, async (req, res) => {
    try {
        const teamName = req.params.team_name;

        const team = await getTeam(teamName);
        const teamUsers = await getTeamMembers(team)
        res.status(200).json(teamUsers);
    }catch (err){
        res.status(500).send('Failed to get teams.');
        console.log(err);
    }
});