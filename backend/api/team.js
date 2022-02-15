import dotenv from 'dotenv';
import express from 'express';
import { createNewTeam, getTeam, getAllTeams } from '../model/team.js';
import { getAllUsers, getUser } from '../model/user.js'
import auth from '../middleware/auth.js';

dotenv.config();
const router = express.Router();
export default router;

// Get all teams
router.get('/', auth, async (req, res) => {
    const teams = await getAllTeams();
    res.status(200).json(teams);
});

// Create new team
router.post('/new', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const { name, teamLeader, productManager } = req.body;

        // Check authority
        if (userRole != 'Admin') {
            return res.status(401).send('You dont have the permission to create a new team. Ask your admin.');   
        }

        // Validate user's input
        if (!name || !teamLeader) {
            res.status(400).send('Team\'s name and TeamLeader fields are required');
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
        const pm = await getUser(productManager);
        if (!pm) {
            return res.status(404).send('ProductManager with this username does not exist');
        }
        
        // Create the team
        await createNewTeam(name, teamLeader, productManager)

        tl.role = 'TeamLeader'
        tl.teamName = name
        await tl.save()

        pm.role = 'ProductManager'
        pm.teamName = name
        await pm.save()

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
        const { teamLeader:newTeamLeader, productManager:newProductManager } = req.body;

        // Check authority
        if (userRole != 'Admin') {
            return res.status(401).send('You dont have the permission to change the teams. Ask your admin.');
        }

        // Get the team
        const team = await getTeam(teamName);
        if (!team) {
            return res.status(409).send('Team with this name does not Exist.');
        }
        
        // update TL
        if (newTeamLeader) {
            const oldTL = await getUser(team.TeamLeader);
            const newTL = await getUser(newTeamLeader);
            if (!newTL) {
                return res.status(404).send('TeamLeader with this username does not exist');
            }

            oldTL.role = 'Normal';
            newTL.role = 'TeamLeader';
            newTL.teamName = teamName
            team.TeamLeader = newTeamLeader;
            
            await oldTL.save();
            await newTL.save();
            await team.save();
        }

        // Update PM
        if (newProductManager) {
            const oldPM = await getUser(team.ProductManager);
            const newPM = await getUser(newProductManager);
            if (!newPM) {
                return res.status(404).send('ProductManager with this username does not exist');
            }

            oldPM.role = 'Normal';
            newPM.role = 'ProductManager';
            newPM.teamName = teamName
            team.ProductManager = newProductManager;
            
            await oldPM.save();
            await newPM.save();
            await team.save();
        }

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
        const teamTL = await getUser(team.TeamLeader);
        if (teamTL) {
            teamTL.role = 'Normal';
            await teamTL.save();
        }

        // Set PM role to normal
        const teamPM = await getUser(team.ProductManager);
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