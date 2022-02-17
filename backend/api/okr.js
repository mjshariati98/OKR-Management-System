import dotenv from 'dotenv';
import express from 'express';
import auth from '../middleware/auth.js';

dotenv.config(); 
const router = express.Router();
export default router;

router.get('/', auth, async (req, res) => {
    try {
        res.status(200).send('ok');
    } catch (error) {
        res.status(500).send('Failed');
        console.log(error);
    }
});