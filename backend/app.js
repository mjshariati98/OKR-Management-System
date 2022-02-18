import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import throttle from './middleware/throttle.js'
import user from './api/user.js';
import team from './api/team.js';
import round from './api/round.js';
import okr from './api/okr.js';
import objective from './api/objective.js';
import kr from './api/kr.js';

dotenv.config(); 

export const app = express();
app.use(express.json());
app.use(cookieParser());

// middlewares
app.use('/api/users/new', throttle);
app.use('/api/users/sign_in', throttle);
app.use('/api/teams', throttle);
app.use('/api/rounds', throttle);
app.use('/api/okrs', throttle);

// endpoints
app.use('/api/users', user);
app.use('/api/teams', team);
app.use('/api/rounds',round);
app.use('/api/okrs', okr);
app.use('/api/okrs', objective);
app.use('/api/okrs', kr);

