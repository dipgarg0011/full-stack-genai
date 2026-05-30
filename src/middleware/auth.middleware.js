const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require("../models/blacklist.model");


async function authUser(req,res,next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message:'No token found'
        })
    }

    const isBlacklisted = await tokenBlacklistModel.findOne({token})
    if(isBlacklisted){
        return res.status(401).json({
            message:'Token is invalid'
        })
    }
    try {
        const decoded= jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({
            message:'Invalid token'
        })
    }
}
module.exports = {authUser}