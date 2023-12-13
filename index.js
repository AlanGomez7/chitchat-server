const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDb = require('./config/db');
const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat');
const messageRoute = require('./routes/message');


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.json())
app.use('/', userRoute)
app.use('/chat', chatRoute);
app.use('/message', messageRoute);
connectDb();

const server = app.listen(3000, () => {
  console.log('listening on port 3000');
})

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin:'http://localhost:5173'
  }
})

io.on('connection',(socket) => {

  socket.on('setup', (user)=>{
    socket.join(user._id)
    socket.emit('connected')
  })

  socket.on('join room', (room) => {
    socket.join(room)
  })

  socket.on('typing', (room)=> socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessage) => {
    var chat = newMessage.chat
    if(!chat.users) return console.log('No users available');
    chat.users.forEach(user => {
      if(user._id == newMessage.sender._id) return
      socket.in(user._id).emit('message received', newMessage);
      
    });
  });
})