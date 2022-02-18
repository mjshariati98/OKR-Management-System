import dotenv from 'dotenv';
import express from 'express';
import auth from '../middleware/auth.js';
import { getOKRByID } from '../model/okr.js';
import { getUser } from '../model/user.js';
import { getObjective } from '../model/objective.js';
import { createNewKR, getKR } from '../model/kr.js';

dotenv.config(); 
const router = express.Router();
export default router;

// Get all KRs of an Objective
router.get('/:okr_id/objectives/:objective_id/', auth, async (req, res) => {
    try {
        const okrID = req.params.okr_id;
        const objectiveID = req.params.objective_id;

        // check OKR exist
        const okr = await getOKRByID(okrID);    
        if (!okr) {
            return res.status(404).send('OKR with this id does not exist.');
        }

        // check Objective exist
        const objective = await getObjective(objectiveID);    
        if (!objective) {
            return res.status(404).send('OBjetive with this id does not exist.');
        }
        
        const krs = await objective.getKrs();
        res.status(200).json(krs);
    } catch (err) {
        res.status(500).send('Failed to list KRs.');
        console.error(err);
    }
});

// Create new KR
router.post('/:okr_id/objectives/:objective_id/new_kr', auth, async (req, res) => {
    try {
        
        const userRole = req.userRole;
        const okrID = req.params.okr_id;
        const objectiveID = req.params.objective_id;
        const { title, description, weight } = req.body;

        // Check authority
        if (userRole != 'Admin' && userRole != 'TeamLeader' && userRole != 'ProductManager') {
            return res.status(401).send('You dont have the permission to create a new objective.');
        }

        // check OKR exists
        const okr = await getOKRByID(okrID);
        if (!okr) {
            return res.status(404).send('OKR with this id does not exist.');
        }

        // TLs and PMs only can create KRs for their own teams
        if (userRole == 'TeamLeader' || userRole == 'ProductManager') {
            const user = await getUser(req.user);
            if (user.teamName != okr.team) {
                return res.status(401).send('You dont have the permission to create a new KR for other teams.');
            }
        }

        // Validate user's input
        if (!title || !weight) {
            return res.status(400).send('Title and weight fields are required.');
        }

        // check Objective exists
        const objective = await getObjective(objectiveID);
        if (!objective) {
            return res.status(404).send('Objective with this id does not exist.');
        }

        // Create the KR
        await createNewKR(title, description, weight, objectiveID);

        res.status(201).json({
            message: 'KR added to Objective successfully'
        });
    }catch (err){
        res.status(500).send('Failed to add KR.');
        console.log(err);
    }
});

// Edit KR
router.put('/:okr_id/objectives/:objective_id/krs/:kr_id', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const okrID = req.params.okr_id;
        const objectiveID = req.params.objective_id;
        const krID = req.params.kr_id;
        const { title:newTitle, description:newDescription, weight:newWeight, done:newDone } = req.body;

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

        // Check Objective matching with OKR
        if (objective.okrId != okrID) {
            return res.status(404).send('This Objecive does not belong to this OKR.');
        }

        // Get the KR
        const kr = await getKR(krID);
        if (!kr) {
            return res.status(409).send('KR with this id does not Exist.');
        }

        // Check KR matching with Objective
        if (kr.objectiveId != objectiveID) {
            return res.status(404).send('This KR does not belong to this Objective.');
        }

        // update title
        if (newTitle && newTitle != kr.title) {
            kr.title = newTitle;
        }

        // update description
        if (newDescription && newDescription != kr.description) {
            kr.description = newDescription;
        }

        // update weight
        if (newWeight && newWeight != kr.weight) {
            kr.weight = newWeight;
        }

        // update done
        if (newDone && newDone != kr.done) {
            kr.done = newDone;
        }

        await kr.save();

        // Response
        res.status(200).send('KR updated succussfully!');
    } catch (err) {
        res.status(500).send('Failed to update the KR.');
        console.log(err);
    }
});

// Delete KR
router.delete('/:okr_id/objectives/:objective_id/krs/:kr_id', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const okrID = req.params.okr_id;
        const objectiveID = req.params.objective_id;
        const krID = req.params.kr_id;

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

        // Check Objective matching with OKR
        if (objective.okrId != okrID) {
            return res.status(404).send('This Objecive does not belong to this OKR.');
        }

        // Get the KR
        const kr = await getKR(krID);
        if (!kr) {
            return res.status(409).send('KR with this id does not Exist.');
        }

        // Check KR matching with Objective
        if (kr.objectiveId != objectiveID) {
            return res.status(404).send('This KR does not belong to this Objective.');
        }

        // Delete the KR
        await kr.destroy();

        // Response
        res.status(200).send('KR deleted succussfully!');
    } catch (err) {
        res.status(500).send('Failed to delete the KR.');
        console.log(err);
    }
});