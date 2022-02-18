import dotenv from 'dotenv';
import express from 'express';
import auth from '../middleware/auth.js';
import { createNewOKR, getOKR, getOKRByID, getAllOKRs } from '../model/okr.js';
import { getTeam } from '../model/team.js';
import { getRound } from '../model/round.js';
import { getUser } from '../model/user.js';

dotenv.config(); 
const router = express.Router();
export default router;

// Get all OKRs
router.get('/', auth, async (req, res) => {
    try {
        const okrs = await getAllOKRs();
        res.status(200).json(okrs);
    } catch (err) {
        res.status(500).send('Failed to list OKRs.');
        console.error(error);
    }
});

// Create new OKR
router.post('/new', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const { description, teamName, roundId } = req.body;

        // Check authority
        if (userRole != 'Admin' && userRole != 'TeamLeader' && userRole != 'ProductManager') {
            return res.status(401).send('You dont have the permission to create a new OKR.');
        }

        // TLs and PMs only can create OKRs for their own teams
        if (userRole == 'TeamLeader' || userRole == 'ProductManager') {
            const user = await getUser(req.user);
            if (user.teamName != teamName) {
                return res.status(401).send('You dont have the permission to create a new OKR for other teams.');
            }
        }

        // Validate user's input
        if (!teamName || !roundId) {
            return res.status(400).send('Team-name and round-ID fields are required.');
        }

        // check if OKR already exist
        const oldOKR = await getOKR(roundId, teamName);
        if (oldOKR) {
            return res.status(409).send('OKR for this team in this round already exist.');
        }

        // Check round already exist
        const round = await getRound(roundId);
        if (!round) {
            return res.status(404).send('Round with this id does not exist.');
        }

        // Check team already exist
        const team = await getTeam(teamName);
        if (!team) {
            return res.status(404).send('Team with this name does not exist.');
        }

        // Create the OKR
        await createNewOKR(roundId, teamName, description);

        res.status(201).json({
            message: 'OKR Created successfully'
        });
    }catch (err){
        res.status(500).send('Failed to create the OKR.');
        console.log(err);
    }
});

// Edit OKR
router.put('/:okr_id', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const okrID = req.params.okr_id;
        const { description:newDescription } = req.body;

        // Check authority
        if (userRole != 'Admin' && userRole != 'TeamLeader' && userRole != 'ProductManager') {
            return res.status(401).send('You dont have the permission to edit OKRs.');
        }

        // Get the OKR
        const okr = await getOKRByID(okrID);
        if (!okr) {
            return res.status(404).send('OKR with this id does not Exist.');
        }

        // TLs and PMs only can edit OKRs of their own teams
        if (userRole == 'TeamLeader' || userRole == 'ProductManager') {
            const user = await getUser(req.user);
            if (user.teamName != okr.team) {
                return res.status(401).send('You dont have the permission to edit an OKR of other teams.');
            }
        }

        // update description
        if (newDescription && newDescription != okr.description) {
            okr.description = newDescription;
        }
        await okr.save();

        // Response
        res.status(200).send('OKR updated succussfully!');
    } catch (error) {
        res.status(500).send('Failed to update the OKR.');
        console.log(error);
    }
});

// Delete OKR
router.delete('/:okr_id', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const okrID = req.params.okr_id;

        // Check authority
        if (userRole != 'Admin' && userRole != 'TeamLeader' && userRole != 'ProductManager') {
            return res.status(401).send('You dont have the permission to delete OKRs.');
        }

        // Get the OKR
        const okr = await getOKRByID(okrID);
        if (!okr) {
            return res.status(409).send('OKR with this id does not Exist.');
        }

        // TLs and PMs only can delete OKRs of their own teams
        if (userRole == 'TeamLeader' || userRole == 'ProductManager') {
            const user = await getUser(req.user);
            if (user.teamName != okr.team) {
                return res.status(401).send('You dont have the permission to delete an OKR of other teams.');
            }
        }

        // Delete OKR's Objectives and KRs
        const objectives = await okr.getObjectives();
        for (const objective of objectives) {
            const krs = await objective.getKrs();
            for (const kr of krs) {
                kr.destroy();
            }
            objective.destroy();
        }

        // Delete the OKR
        await okr.destroy();

        // Response
        res.status(200).send('OKR deleted succussfully!');
    } catch (error) {
        res.status(500).send('Failed to delete the OKR.');
        console.log(error);
    }
});