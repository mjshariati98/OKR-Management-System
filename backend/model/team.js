import Sequelize from 'sequelize';
import { dbClient } from '../config/db.js'

export const Team = dbClient.define('team', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
}, {
    freezeTableName: true
});

export const createNewTeam = async (name, teamLeader, productManager=null) => {
    return await Team.create({
        name: name,
        TeamLeader: teamLeader,
        ProductManager: productManager
    });
}

export const getTeam = async (team_name) => {
    return await Team.findOne({
        where: {
            name: team_name
        }
    });
}

export const getAllTeams = async () => {
    return await Team.findAll();
}

export const getTeamMembers = async (team) => {
    return await team.getUsers( { attributes: { exclude: ['password'] } });
}