import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUser, createNewUser, getAllUsers } from '../model/user.js';
import auth from '../middleware/auth.js';

dotenv.config();
const router = express.Router();
export default router;

// Get all users
router.get('/', auth, async (req, res) => {
    const users = await getAllUsers();
    res.status(200).json(users);
});

// Create new user
router.post('/new', auth, async (req, res) => {
    try {
        const userRole = req.userRole
        const { username, firstname,lastname, email, phone } = req.body;

        // Check authority
        if (userRole != 'Admin' && userRole != 'TeamLeader') {
            return res.status(401).send('You dont have the permission to add a new user. Ask your admin or TeamLeader.');   
        }

        // Validate user's input
        if (!(username)) {
            res.status(400).send('Username is required');
        }

        // check if user already exist
        const oldUser = await getUser(username);
        if (oldUser) {
            return res.status(409).send('Username Already Exist.');
        }

        // Create token
        const token = createToken(username, process.env.EXPIRE_DURATION)

        // Create new user
        const password = random_password(process.env.RAND_PASS_LENGTH)
        await createNewUser(username, firstname,lastname, email, phone, password)

        // Response
        res.status(201).json({
            message: 'User created successfully',
            username: username,
            password: password
        });
    } catch (error) {
        res.status(500).send('Failed to Sign up.');
        console.error(error);
    }
});

router.delete('/', auth, async (req, res) => {
    try {
        const userRole = req.userRole
        const { username } = req.body;

        // Check authority
        if (userRole != 'Admin') {
            return res.status(401).send('You dont have the permission to delete users. Ask your admin.');
        }

        // Validate user's input
        if (!(username)) {
            res.status(400).send('Username is required');
        }

        // check if user already exist
        const user = await getUser(username);
        if (!user) {
            return res.status(409).send('User with this username does not exists.');
        }

        user.destroy();

        // Response
        res.status(201).json({
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).send('Failed to delete user');
        console.error(error);
    }
});

// Log in
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
            const token = createToken(username, process.env.EXPIRE_DURATION)

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

// Log out
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

// Get profile of logged-in user
router.get('/profile', auth, async (req, res) => {
    const username = req.user;
    res.status(200).send({ username });
});

// helper functions 
const createToken = (username, expireDuration) => {
    return jwt.sign(
        { username: username },
        process.env.TOKEN_KEY,
        { expiresIn: expireDuration}
    );
}

const random_password = (length) => {
    var result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}