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
    stake: {
        type: Sequelize.FLOAT,
        allowNull: false,
        description: 'in percent'
    }
}, {
    freezeTableName: true
});