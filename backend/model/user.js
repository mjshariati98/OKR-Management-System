import Sequelize from 'sequelize';
import bcrypt from 'bcryptjs';
import { dbClient } from '../config/db.js'

export const User = dbClient.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },   
    email: { 
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "normal"
    }
}, {
    freezeTableName: true
});

export const getUser = async (username) => {
    return await User.findOne({
        where: {
            username: username
        }
    });
}

export const createNewUser = async (name, username, email, password, role) => {
    // Encrypt user'a password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create new user
    return await User.create({
        name: name,
        username: username,
        email: email,
        password: encryptedPassword,
        role: (role || 'normal')
    });
}