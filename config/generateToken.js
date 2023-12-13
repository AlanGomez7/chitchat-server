const jwt = require('jsonwebtoken');

const generateToken=(email)=>{
   return jwt.sign({email}, 'secret', {expiresIn: '2h'})
}

module.exports = generateToken