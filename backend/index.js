import dotenv from 'dotenv';
import http from 'http';
import { dbClient } from './config/db.js';
import { User, getUser, createNewUser } from './model/user.js';
import { Team } from './model/team.js';
import { Round } from './model/round.js';
import { OKR } from './model/okr.js';
import { Objective } from './model/objective.js';
import { KR } from './model/kr.js';
import { app } from './app.js';

dotenv.config();

const connectDB = async () => {
    await dbClient.authenticate().
    then(() => {
        console.log('Successfully connected to database.');
    }).
    catch(async err => {
        console.error('database connection failed. retrying in 5 seconds...', err);
        await new Promise(resolve => setTimeout(resolve, 5000));
        await connectDB();
    });
}

const syncModels = async () => {
    // User and Team models
    await User.sync();
    await Team.sync();

    User.hasOne(Team, {
        as: 'teamLeader',
        foreignKey: 'teamLeader'
    });
    User.hasOne(Team, {
        as: 'productManager',
        foreignKey: 'productManager'
    });
    Team.hasMany(User);

    await User.sync({ alter: true });
    await Team.sync({ alter: true });

    // Round, OKR, Objective, and KR models
    await Round.sync();
    await OKR.sync();
    await Objective.sync();
    await KR.sync();

    Team.hasOne(OKR, {
        as: 'team',
        foreignKey: 'team'
    });
    Round.hasMany(OKR);
    OKR.hasMany(Objective);
    Objective.hasMany(KR);

    await Round.sync({ alter: true });
    await OKR.sync({ alter: true });
    await Team.sync({ alter: true });
    await Objective.sync({ alter: true });
    await KR.sync({ alter: true });
}

const createAdminUser = async () => {
    const adminUser = await getUser(process.env.SERVER_ADMIN_USERNAME);
    if (!adminUser) {
        await createNewUser(
            process.env.SERVER_ADMIN_USERNAME,
            process.env.SERVER_ADMIN_FRISTNAME,
            process.env.SERVER_ADMIN_LASTNAME,
            process.env.SERVER_ADMIN_EMAIL,
            process.env.SERVER_ADMIN_PHONE,
            process.env.SERVER_ADMIN_PASSWORD,
            'Admin');
        console.log('Admin user created.');
    }
}

const initializeThrottlingCache = () => {
    global.throttlingCache = new Map();
}

const listen = () => {
    const server = http.createServer(app);
    server.listen(process.env.SERVER_PORT, () => {
        console.log(`Server running on port ${process.env.SERVER_PORT}`);
    });
}

const start = async() => {
    await connectDB();
    await syncModels();
    await createAdminUser();
    initializeThrottlingCache();
    listen();
}

await start();