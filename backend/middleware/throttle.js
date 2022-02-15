import dotenv from 'dotenv';

dotenv.config();
export { throttle as default };

const throttle = (req, res, next) => {
    const userIP = req.ip;
    let userRequestDates = throttlingCache.get(userIP) || [];

    if (userRequestDates.length > 0) {
        userRequestDates = checkTTL(userRequestDates);
        if (userRequestDates.length > process.env.THROTTLING_LIMIT) {
            return res.status(429).send(`You can't send more than ${process.env.THROTTLING_LIMIT} requests in ${process.env.THROTTLING_INTERVAL} seconds.`);
        }
    }
    userRequestDates.push(new Date());
    throttlingCache.set(userIP, userRequestDates);

    return next();
};

// helper functions
const checkTTL = (userRequestDates) => {
    for (var i=0; i< userRequestDates.length; i++) {
        if (toSeconds(Date.now() - userRequestDates[i]) > process.env.THROTTLING_INTERVAL) {
            userRequestDates.splice(i, 1);
            i--;
        }
    }
    return userRequestDates;
}

const toSeconds = (time) => {
    return time / 1000;
} 
