import dotenv from 'dotenv';
import http from 'http';
import { dbClient } from './config/db.js';
import { User, getUser, createNewUser } from './model/user.js';
import { Team } from './model/team.js';
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
    // Associations
    Team.hasMany(User)
    User.belongsTo(Team)

    await Team.sync();
    await User.sync();
}

const createAdminUser = async () => {
    const adminUser = await getUser(process.env.SERVER_ADMIN_USERNAME);
    if (!adminUser) {
        await createNewUser(
            process.env.SERVER_ADMIN_NAME,
            process.env.SERVER_ADMIN_USERNAME,
            process.env.SERVER_ADMIN_EMAIL,
            process.env.SERVER_ADMIN_PASSWORD,
            'admin');
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