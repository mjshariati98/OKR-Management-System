import Sequelize from 'sequelize';
import { dbClient } from '../config/db.js';

export const OKR = dbClient.define('okr', {
    description: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true
});

export const getOKR = async (roundId, teamName) => {
    return await OKR.findOne({
        where: {
            roundId: roundId,
            team: teamName
        }
    });
};

export const getOKRByID = async (id) => {
    return await OKR.findOne({
        where: {
            id: id
        }
    });
};

export const getOKRByRound = async (roundId) => {
    return await OKR.findAll({
        where: {
            roundId: roundId
        }
    });
};

export const getAllOKRs = async () => {
    return await OKR.findAll();
};

export const createNewOKR = async (round, team, description) => {
    return await OKR.create({
        description: description,
        roundId: round,
        team: team
    });
};