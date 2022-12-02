const JWT = require('jsonwebtoken');
const User = require("../model/UserModel")


const auth = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = JWT.verify(token, process.env.SECRECT_TOKEN)

            req.user = decoded.user;

            next()
        } catch (error) {
            res.status(401).json({ msg: "Token not valid" })
        }
    }

    if (!token) {
        res.status(401).json('Not Authorized, Please Login first')
    }
}

module.exports = auth