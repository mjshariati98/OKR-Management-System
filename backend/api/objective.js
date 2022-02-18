import dotenv from 'dotenv';
import express from 'express';
import auth from '../middleware/auth.js';
import { getOKRByID } from '../model/okr.js';
// import { getTeam } from '../model/team.js';
// import { getRound } from '../model/round.js';
import { getUser } from '../model/user.js';
import { createNewObjective, getObjective } from '../model/objective.js';
import { KR } from '../model/kr.js'; 

dotenv.config(); 
const router = express.Router();
export default router;

// Get all objectives of an OKR
router.get('/:okr_id/objectives', auth, async (req, res) => {
    try {
        const okrID = req.params.okr_id;

        // check OKR exist
        const okr = await getOKRByID(okrID);    
        if (!okr) {
            return res.status(404).send('OKR with this id does not exist.');
        }
        
        const objectives = await okr.getObjectives({ include: KR });
        res.status(200).json(objectives);
    } catch (err) {
        res.status(500).send('Failed to list Objectives.');
        console.error(error);
    }
});

// // Create new Objective
router.post('/:okr_id/new_objective', auth, async (req, res) => {
    try {
        
        const userRole = req.userRole;
        const okrID = req.params.okr_id;
        const { title, description, weight } = req.body;

        // Check authority
        if (userRole != 'Admin' && userRole != 'TeamLeader' && userRole != 'ProductManager') {
            return res.status(401).send('You dont have the permission to create a new objective.');
        }

        // check OKR exist
        const okr = await getOKRByID(okrID);
        if (!okr) {
            return res.status(404).send('OKR with this id does not exist.');
        }

        // TLs and PMs only can create OKRs for their own teams
        if (userRole == 'TeamLeader' || userRole == 'ProductManager') {
            const user = await getUser(req.user);
            if (user.teamName != okr.team) {
                return res.status(401).send('You dont have the permission to create a new objective for other teams.');
            }
        }

        // Validate user's input
        if (!title || !weight) {
            return res.status(400).send('Title and weight fields are required.');
        }

        // Create the objective
        await createNewObjective(title, description, weight, okrID);

        res.status(201).json({
            message: 'Objective added to OKR successfully'
        });
    }catch (err){
        res.status(500).send('Failed to add objective.');
        console.log(err);
    }
});

// Edit Objective
router.put('/:okr_id/objectives/:objective_id', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const okrID = req.params.okr_id;
        const objectiveID = req.params.objective_id
        const { title:newTitle, description:newDescription, weight:newWeight } = req.body;

        // Check authority
        if (userRole != 'Admin' && userRole != 'TeamLeader' && userRole != 'ProductManager') {
            return res.status(401).send('You dont have the permission to edit Objecives.');
        }

        // check OKR exist
        const okr = await getOKRByID(okrID);
        if (!okr) {
            return res.status(404).send('OKR with this id does not exist.');
        }

        // TLs and PMs only can edit Objectives of their own teams
        if (userRole == 'TeamLeader' || userRole == 'ProductManager') {
            const user = await getUser(req.user);
            if (user.teamName != okr.team) {
                return res.status(401).send('You dont have the permission to edit an Objecitve of other teams.');
            }
        }

        // Get the Objetive
        const objective = await getObjective(objectiveID);
        if (!objective) {
            return res.status(404).send('Objecive with this id does not Exist.');
        }

        // Check okr matching
        if (objective.okrId != okrID) {
            return res.status(404).send('This Objecive does not belong to this OKR.');
        }

        // update title
        if (newTitle && newTitle != objective.title) {
            objective.title = newTitle;
        }

        // update description
        if (newDescription && newDescription != objective.description) {
            objective.description = newDescription;
        }

        // update weight
        if (newWeight && newWeight != objective.weight) {
            objective.weight = newWeight;
        }

        await objective.save();

        // Response
        res.status(200).send('Objective updated succussfully!');
    } catch (error) {
        res.status(500).send('Failed to update the Objective.');
        console.log(error);
    }
});

// Delete Objective
router.delete('/:okr_id/objectives/:objective_id', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const okrID = req.params.okr_id;
        const objectiveID = req.params.objective_id

        // Check authority
        if (userRole != 'Admin' && userRole != 'TeamLeader' && userRole != 'ProductManager') {
            return res.status(401).send('You dont have the permission to delete Objectives.');
        }

        // check OKR exist
        const okr = await getOKRByID(okrID);
        if (!okr) {
            return res.status(404).send('OKR with this id does not exist.');
        }

        // TLs and PMs only can delete Objectives of their own teams
        if (userRole == 'TeamLeader' || userRole == 'ProductManager') {
            const user = await getUser(req.user);
            if (user.teamName != okr.team) {
                return res.status(401).send('You dont have the permission to delete an Objetive of other teams.');
            }
        }

        // Get the objective
        const objective = await getObjective(objectiveID);
        if (!objective) {
            return res.status(409).send('Objective with this id does not Exist.');
        }

        // Check okr matching
        if (objective.okrId != okrID) {
            return res.status(404).send('This Objecive does not belong to this OKR.');
        }

        // Delete the Objective
        await objective.destroy();

        // Response
        res.status(200).send('objective deleted succussfully!');
    } catch (error) {
        res.status(500).send('Failed to delete the objective.');
        console.log(error);
    }
});