import Sequelize from 'sequelize';
import { dbClient } from '../config/db.js'

export const KR = dbClient.define('kr', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    weight: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
});

export const createNewKR = async (title, description, weight, objectiveID) => {
    return await KR.create({
        title: title,
        description: description,
        weight: weight,
        objectiveId: objectiveID
    });
};

export const getKR = async (krID) => {
    return await KR.findOne({
        where: {
            id: krID
        }
    });
};