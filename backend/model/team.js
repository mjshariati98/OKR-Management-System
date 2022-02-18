import Sequelize from 'sequelize';
import { dbClient } from '../config/db.js'

export const Team = dbClient.define('team', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true
});

export const createNewTeam = async (name, description, teamLeader, productManager=null) => {
    return await Team.create({
        name: name,
        description: description,
        teamLeader: teamLeader,
        productManager: productManager
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