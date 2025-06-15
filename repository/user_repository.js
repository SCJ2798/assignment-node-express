
const HttpResponseError = require("../error/http_response_error");
const { Role } = require("../common/enum");
const { sequelize } = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { 
    User
 } = require("../models");

module.exports.registerUser = ({first_name,last_name,email,password}) => {
    return new Promise(async(resolve,reject) => {
        const dbTransaction = await sequelize.transaction();
        try {
            const salt = process.env.USER_PASSWORD_SALT;
            const hashedPassowrd = await bcrypt.hash(password,Number(salt));
            const userRecord = await User.create({
                first_name,
                last_name,
                email,
                role:Role.END_USER,
                password:hashedPassowrd
            },{
            attributes: {
                exclude: ['id']
            },
            transaction : dbTransaction});
            await dbTransaction.commit();
            resolve(userRecord);
        } catch (error) {
            console.log(error);
            await dbTransaction.rollback();
            console.log("USER ROLL BACKED");
            reject(error);
        }
    });
}
module.exports.loginUser = ({email,password}) => {
    return new Promise(async(resolve,reject) => {
        try {
            const existedUser = await User.findOne({where:{email:email}});
            if(!existedUser) throw new HttpResponseError(404,"AUTHENTICATION FAILED - USER NOT FOUND");
            const compareMatch = await bcrypt.compare(password,existedUser.password);
            if(!compareMatch) throw new HttpResponseError(403,"AUTHENTICATION FAILED - PASSWORD NOT MATCHED");
            const secretKey = process.env.USER_JWT_TOKEN_SECRET_KEY;
            const userToken = jwt.sign({
                data:{     
                    uuid:existedUser.uuid,
                    first_name:existedUser.first_name,
                    last_name:existedUser.last_name,
                    email:existedUser.email,
                    role:existedUser.role,
                },
                exp:Math.floor(Date.now()/1000 + (60 * 60))
            },secretKey);
            resolve({token:userToken,user_uuid:existedUser.uuid});

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}







