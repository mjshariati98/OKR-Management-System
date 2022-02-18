import Sequelize from 'sequelize';
import { dbClient } from '../config/db.js';
import { Objective } from './objective.js';
import { KR } from './kr.js';

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
        },
        include: [{
            model: Objective,
            include: [
                KR
            ]
        }]
    });
};

export const getOKRByRound = async (roundId) => {
    return await OKR.findAll({
        where: {
            roundId: roundId
        },
        include: [{
            model: Objective,
            include: [
                KR
            ]
        }]
    });
};

export const getOKRByTeam = async (teamName) => {
    return await OKR.findAll({
        where: {
            team: teamName
        },
        include: [{
            model: Objective,
            include: [
                KR
            ]
        }]
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