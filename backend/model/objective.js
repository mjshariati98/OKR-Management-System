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
    stake: {
        type: Sequelize.FLOAT,
        allowNull: false,
        description: 'in percent'
    }
}, {
    freezeTableName: true
});