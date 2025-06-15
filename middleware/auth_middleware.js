const jwt = require('jsonwebtoken');
const { Role } = require('../common/enum');

module.exports.isEndUserAuthorized = (req,res,next) => {
    try {
        const bearedToken = req.header('Authorization');
        if(!bearedToken) throw new Error("INVALID TOKEN");
        const token = bearedToken.split(" ")[1];
        if(!token) throw new Error("INVALID TOKEN");
        const secretKey = process.env.USER_JWT_TOKEN_SECRET_KEY;
        const decoded = jwt.verify(token,secretKey);
        req.user_uuid = decoded.data.uuid;
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(401)
        .json({
            msg:"ERROR",
            data:{
                error:"Invalid Token"
            }
        });
    }
}

module.exports.isAdminAuthorized = (req,res,next) => {
    try {
        const bearedToken = req.header('Authorization');
        if(!bearedToken) throw new Error("INVALID TOKEN");
        const token = bearedToken.split(" ")[1];
        if(!token) throw new Error("INVALID TOKEN");

        const secretKey = process.env.USER_JWT_TOKEN_SECRET_KEY;
        const decoded = jwt.verify(token,secretKey);
        if(!(decoded.data.role == Role.ADMIN || decoded.data.role == Role.SUPER_ADMIN) ) throw new Error("INVALID TOKEN");
        req.user_uuid = decoded.data.uuid;
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(401)
        .json({
            msg:"ERROR",
            data:{
                error:"Invalid Token"
            }
        });
    }
}

