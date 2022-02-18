import Sequelize from 'sequelize';
import { dbClient } from '../config/db.js'

export const Round = dbClient.define('round', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    freezeTableName: true
});

export const createNewRound = async (id, name) => {
    return await Round.create({
        id: id,
        name: name
    });
};

export const getRound = async (id) => {
    return await Round.findOne({
        where: {
            id: id
        }
    });
};

export const getAllRounds = async () => {
    return await Round.findAll();
};