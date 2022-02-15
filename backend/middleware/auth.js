import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { getRole } from '../model/user.js'

dotenv.config();
export { verifyToken as default };

const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(403).send('You need to login first!');
    }
    try {
        const { username } = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = username;
        const role = await getRole(username);
        req.userRole = role;
    } catch (error) {
        console.log(error);
        return res.status(401).send('Invalid Token. Login again!');
    }
    return next();
};
