const mongoose = require('mongoose');

const connectDB = async()=>{
    try {
        const con = await mongoose.connect("mongodb+srv://alangomez0047:pcxkdHa4IPjPYpzu@cluster0.r3ynnkx.mongodb.net/", {useNewUrlParser: true});
        console.log('Database connection established')
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDB

// User.findOne({ email: { $in: [req.body.email] } }).then(user => {
//     if (!user){
//       res.status(401)
//       throw new Error ('User not found')
//     }      
//     if (user.email === req.body.email && user.password === req.body.password) {
//       res.json({ message: 'success', status: 200 });
//     } else {
//       res.json({ message: 'failed', status: 401 });
//     };
//   });