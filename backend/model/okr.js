import Sequelize from 'sequelize';
import { dbClient } from '../config/db.js'

export const OKR = dbClient.define('okr', {
    description: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true
});