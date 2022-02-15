import dotenv from 'dotenv';
import Sequelize from 'sequelize';

dotenv.config(); 

const {POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASS} = process.env;
const connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@${POSTGRES_HOST}:${POSTGRES_PORT}`
export const dbClient = new Sequelize(connectionString)
