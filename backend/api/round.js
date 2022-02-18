import dotenv from 'dotenv';
import express from 'express';
import auth from '../middleware/auth.js';
import { createNewRound, getRound, getAllRounds } from '../model/round.js';

dotenv.config();
const router = express.Router();
export default router;

// Get all rounds
router.get('/', auth, async (req, res) => {
    try {
        const rounds = await getAllRounds();
        res.status(200).json(rounds);
    } catch (err) {
        res.status(500).send('Failed to list rounds.');
        console.error(error);
    }
});

// Create new round
router.post('/new', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const { id, name } = req.body;

        // Check authority
        if (userRole != 'Admin') {
            return res.status(401).send('You dont have the permission to create a new round. Ask your admin.');   
        }

        // Validate user's input
        if (!id || !name) {
            return res.status(400).send('Round\'s id and name fields are required.');
        }

        // check if round already exist
        const oldRound = await getRound(id);
        if (oldRound) {
            return res.status(409).send('Round Already Exist.');
        }
        
        // Create the round
        await createNewRound(id, name)

        res.status(201).json({
            message: 'Round Created successfully'
        });
    }catch (err){
        res.status(500).send('Failed to create the round.');
        console.log(err);
    }
});

// Edit round
router.put('/:round_id', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const roundID = req.params.round_id;
        const { name:newName } = req.body;

        // Check authority
        if (userRole != 'Admin') {
            return res.status(401).send('You dont have the permission to edit rounds. Ask your admin.');
        }

        // Get the round
        const round = await getRound(roundID);
        if (!round) {
            return res.status(409).send('Round with this id does not Exist.');
        }

        // update name
        if (newName && newName != round.name) {
            round.name = newName;
        }

        await round.save();

        // Response
        res.status(200).send('Round updated succussfully!');
    } catch (err) {
        res.status(500).send('Failed to update the round.');
        console.log(err);
    }
});

// Delete round
router.delete('/:round_id', auth, async (req, res) => {
    try {
        const userRole = req.userRole;
        const roundID = req.params.round_id;

        // Check authority
        if (userRole != 'Admin') {
            return res.status(401).send('You dont have the permission to delete rounds. Ask your admin.');
        }
        
        // Get the round
        const round = await getRound(roundID);
        if (!round) {
            return res.status(409).send('Round with this id does not Exist.');
        }

        // Check no associated okr
        const roundOKRs = await round.getOkrs();
        if (roundOKRs.length != 0){
            return res.status(400).json({
                message: 'There are some OKRs for this round. To delete the round, you need to delete them first.',
                okrs: roundOKRs
            });
        }

        // Delete the round
        await round.destroy();

        // Response
        res.status(200).send('Round deleted succussfully!');
    } catch (err) {
        res.status(500).send('Failed to delete the round.');
        console.log(err);
    }
});
