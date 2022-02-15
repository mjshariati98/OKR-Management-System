import Sequelize from 'sequelize';
import { dbClient } from '../config/db.js'
import { User } from './user.js';

export const Team = dbClient.define('team', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
}, {
    freezeTableName: true
});
