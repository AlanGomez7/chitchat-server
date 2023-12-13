const User = require('../model/userModel');
const generateToken = require('../config/generateToken');

const login = async (req, res) => {
    try {
      const userDetails = await User.findOne({ email: { $in: [req.body.email]}}).lean();
       if (!userDetails){
        res.status(401).send({message: 'User not found'})
        throw new Error ('User not found')
      }      
      if (userDetails.email === req.body.email && userDetails.password === req.body.password) {
        const token = generateToken(userDetails.email)
        userDetails.token = token;
        res.status(200).send(userDetails);
      } else {
        res.status(404).send('Invalid credentials')
      };
    } catch (error) {
      console.log(error);
    }
}

const search = async (req, res) => {
  const keyword = req.query.search?{
    $or: [
      {name: {$regex: req.query.search, $options: "i"}},
      {email: {$regex: req.query.search, $options: "i"}}
    ]
  }:{}
   await User.find(keyword).find({_id: {$ne: req.headers.authorization}}).then(user => {
    const result = user.map(userDetails => {return userDetails})
    res.send(result)
  }).catch(err => console.log(err));
}

const signup =  (req, res) => {
  const user = new User(req.body)
  user.save()
  res.status(200).send({message: 'created'})
}


module.exports = {login, search, signup}