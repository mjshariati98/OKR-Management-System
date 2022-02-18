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
app.use('/users/new', throttle);
app.use('/users/sign_in', throttle);
app.use('/teams', throttle);
app.use('/rounds', throttle);
app.use('/okrs', throttle);

// endpoints
app.use('/users', user);
app.use('/teams', team);
app.use('/rounds',round);
app.use('/okrs', okr);
app.use('/okrs', objective);
app.use('/okrs', kr);

