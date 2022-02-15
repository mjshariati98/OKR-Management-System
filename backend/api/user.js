import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUser, createNewUser } from '../model/user.js';

dotenv.config();
const router = express.Router();
export default router;

router.post('/sign_up', async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Validate user's input
        if (!(username && email && password)) {
            res.status(400).send('All inputs are required');
        }

        // check if user already exist
        const oldUser = await getUser(username);
        if (oldUser) {
            return res.status(409).send('User Already Exist.');
        }

        // Create token
        const token = createToken(username, null, process.env.EXPIRE_DURATION)

        // Create new user
        await createNewUser(name, username, email, password)

        // Response
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false,
        }).status(201).json({message: 'Sign up successfully'});
    } catch (error) {
        res.status(500).send('Failed to Sign up.');
        console.error(error);
    }
});


router.post('/sign_in', async (req, res) => {
    try {
        const { username, password } = req.body;
    
        // Validate user input
        if (!(username && password)) {
          res.status(400).send('All inputs are required');
        }

        // Validate if user exist in our database
        const user = await getUser(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = createToken(username, user.role, process.env.EXPIRE_DURATION)

            // Response
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: false,
            }).status(200).json({message: 'Logged in successfully'});
        } else {
            res.status(400).send('Invalid Credentials');    
        }
    } catch (err) {
        res.status(500).send('Failed to log in.');
        console.log(err);
    }
});

router.post('/sign_out', async (req, res) => {
    try {
        res.clearCookie('access_token')
        .status(200)
        .json({ message: 'Successfully logged out' });
    } catch (err) {
        res.status(500).send('Failed to logout.');
        console.log(err);
    }
});

// helper functions 
const createToken = (username, role, expireDuration) => {
    return jwt.sign(
        { username: username, role: role},
        process.env.TOKEN_KEY,
        { expiresIn: expireDuration}
    );
}