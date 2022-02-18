import Sequelize from 'sequelize';
import bcrypt from 'bcryptjs';
import { dbClient } from '../config/db.js'

export const User = dbClient.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    firstname: {
        type: Sequelize.STRING,
        allowNull: true,
        primaryKey: false
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: true,
        primaryKey: false
    },   
    email: { 
        type: Sequelize.STRING,
        allowNull: true
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: [['Admin', 'TeamLeader', 'ProductManager', 'Normal']],
        },
        defaultValue: "normal"
    }
}, {
    freezeTableName: true
});

export const getUser = async (username) => {
    return await User.findOne({
        where: {
            username: username
        },
        attributes: { exclude: ['password']}
    });
};

export const getAllUsers = async () => {
    return await User.findAll({ attributes: { exclude: ['password'] } });
};

export const getRole = async (username) => {
    const user = await User.findOne({
        where: {
            username: username
        },
        attributes: ['role'],
        raw: true
    });
    return user.role
};

export const getUserPassword = async (username) => {
    const user = await User.findOne({
        where: {
            username: username
        }
    });
    return user.password
};

export const createNewUser = async (username, firstname,lastname, email, phone, password, role=null) => {
    // Encrypt user's password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create new user
    return await User.create({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        password: encryptedPassword,
        role: (role || 'Normal')
    });
};