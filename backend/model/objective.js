import Sequelize from 'sequelize';
import { dbClient } from '../config/db.js'

export const Objective = dbClient.define('objective', {
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

export const createNewObjective = async (title, description, weight, okrID) => {
    return await Objective.create({
        title: title,
        description: description,
        weight: weight,
        okrId: okrID
    });
};

export const getObjective = async (objectiveID) => {
    return await Objective.findOne({
        where: {
            id: objectiveID
        }
    });
};