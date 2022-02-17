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