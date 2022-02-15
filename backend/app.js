import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import user from './api/user.js';
import throttle from './middleware/throttle.js'

dotenv.config(); 

export const app = express();
app.use(express.json());
app.use(cookieParser());

// middlewares
app.use('/users/sign_up', throttle);
app.use('/users/sign_in', throttle);

// endpoints
app.use('/users', user);
