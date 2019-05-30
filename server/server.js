const path = require('path');
const http = require('http');
const cors = require('cors');
const config = require('./config.js')
const bodyParser = require('body-parser');
const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const publicPath = path.join(__dirname, '../public');
const AdminModel = require('./model/admin.js');
const port = process.env.PORT || 5000;
var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
var server = http.createServer(app);
const jwt = require('jsonwebtoken');
var io = socketIO(server);
app.use(express.static(publicPath));
const userController = require('./controllers/UserController.js');
const userMiddleware = require('./middleware/UserMiddleware.js');


mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/chat-app', { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;
app.post('/loginAdmin', userController.AdminLogin);
//▬▬▬▬▬▬ Authentication middleware ▬▬▬▬▬▬
app.use('/Admin/isLoggedIn',userMiddleware.Authentication);
app.post('/Admin/isLoggedIn', userController.isLoggedInAdmin);

app.use('/get-user-list',userMiddleware.Authentication);
app.post('/get-user-list', userController.getUserList);
app.post('/login', userController.login);
//▬▬▬▬▬▬ Authentication middleware ▬▬▬▬▬▬
app.use(userMiddleware.Authentication);
app.post('/isLoggedIn', userController.isLoggedIn);
io.on('connection', (socket) => {
  socket.on('join', (params) => {
    jwt.verify(params.api_token, config.secret, (err, decode) => {
      if (err) {
        return socket.disconnect();
      }
      if (decode.Account_id === undefined) {
        return socket.disconnect();
      }
      AdminModel.findById(decode.Account_id,(err,admin)=>{
        if(admin){ socket.join(params.room) }
        else socket.join(decode.Account_id);
      })

      
    });

  });
  socket.on('createMessage', (params) => {
    
    jwt.verify(params.api_token, config.secret, (err, decode) => {
      if (err) {
        return socket.disconnect();
      }
      if (decode.Account_id === undefined) {
        return socket.disconnect();
      }
      io.to(decode.Account_id).emit('newMessage', { msg: params.message });
    });
    
  
  });
  socket.on('createMessageAdmin', (params) => {
    
    jwt.verify(params.api_token, config.secret, (err, decode) => {
      if (err) {
        return socket.disconnect();
      }
      if (decode.Account_id === undefined) {
        return socket.disconnect();
      }
      io.to(params.room).emit('newMessage', { msg: params.message });
    });
    
  
  });
  socket.on('disconnect', () => {
    console.log("disconnect")
  });
});
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
