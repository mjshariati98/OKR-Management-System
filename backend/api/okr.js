import dotenv from 'dotenv';
import express from 'express';
import auth from '../middleware/auth.js';
import { createNewOKR, getOKR, getOKRByID, getAllOKRs, getOKRByTeam, getOKRByRound } from '../model/okr.js';
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

// Get OKR by ID
router.get('/:okr_id', auth, async (req, res) => {
    try {
        const okrID = req.params.okr_id;

        const okr = await getOKRByID(okrID);
        const okrWithProgress = calculateOKRProgress(okr);
        res.status(200).json(okrWithProgress);
    } catch (err) {
        res.status(500).send('Failed to list OKRs.');
        console.error(err);
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
        const okr = await createNewOKR(roundId, teamName, description);

        res.status(201).json({
            message: 'OKR Created successfully',
            'id': okr.id
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
    } catch (err) {
        res.status(500).send('Failed to update the OKR.');
        console.log(err);
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
    } catch (err) {
        res.status(500).send('Failed to delete the OKR.');
        console.log(err);
    }
});

// Get all OKRs of a team
router.get('/by_team/:team_name', auth, async (req, res) => {
    try {
        const teamName = req.params.team_name;

        const okrs = await getOKRByTeam(teamName);
        for (const okr of okrs) {
            calculateOKRProgress(okr);
        }
        res.status(200).json(okrs);
    } catch (err) {
        res.status(500).send('Failed to list okrs.');
        console.error(err);
    }
});

// Get all OKRs in a round
router.get('/by_round/:round_id', auth, async (req, res) => {
    try {
        const roundID = req.params.round_id;

        const okrs = await getOKRByRound(roundID);
        for (const okr of okrs) {
            calculateOKRProgress(okr);
        }
        res.status(200).json(okrs);
    } catch (err) {
        res.status(500).send('Failed to list okrs.');
        console.error(err);
    }
});


// helper functions
export const calculateOKRProgress = (okr) => {
    var sumWeights = 0;
    for (const objective of okr.objectives) {
        const objectiveProgress = calculateObjectiveProgress(objective);
        objective.setDataValue('objectiveProgress', objectiveProgress)

        sumWeights += objective.weight;
    }
    var okrProgress = 0;
    for (const objective of okr.objectives) {
        okrProgress += (objective.weight / sumWeights) * objective.getDataValue('objectiveProgress');
    }
    okr.setDataValue('okrProgress', okrProgress)
    return okr;
}

export const calculateObjectiveProgress = (objective) => {
    var sumWeights = 0;
    for (const kr of objective.krs) {
        sumWeights += kr.weight;
    }
    var progress = 0;
    for (const kr of objective.krs) {
        progress += (kr.weight / sumWeights) * kr.done;
    }
    return progress;
}