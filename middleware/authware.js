const user = require('../model/userModel');
const authMiddleware = async(req, res)=>{
    if(req.headers.authorization){
        const token = req.headers.authorization;
        console.log(token);
    }else{
        console.log('fucked')
    }
}

module.exports = authMiddleware;