import React, { Component } from 'react';
import cookie from 'react-cookies';
import socketIOClient from 'socket.io-client'
import "./chat.css"
const config = require('./config.js')

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
          messages:[],
        
        }
        
    }
    componentDidMount() {
        const socket = socketIOClient(`${config.server}:${config.port}`);
        const api_token = cookie.load('api_token');
        socket.on('connect', function () {
            socket.emit('join', { api_token }, function (err) {
            });
        });
        socket.on('newMessage', (message)=>this.msg(message)
               
        );
    }
  msg(message){
      const {messages}=this.state
      this.setState({messages:[...messages,message.msg]})
  }
    handleSubmit(e) {
        this.setState({})
        const socket = socketIOClient(`${config.server}:${config.port}`);
        const api_token = cookie.load('api_token');
        e.preventDefault();
        socket.emit('createMessage', {
            message: this.input.value, api_token: api_token
        })
        this.input.value=""
    }
    render() {
        return (
            <div className="chat">
                <div className="chat__sidebar">
                    <h3> اعضا</h3>
                    <div id="users"></div>
                </div>
                <div className="chat__main">
                    <ol id="messages" className="chat__messages">
                    {this.state.messages.map((message)=>{
                         return <li style={{padding:10,backgroundColor:"gray",margin:3}}>{message}</li>
                    })}
                    </ol>
                    <div className="chat__footer">
                        <form onSubmit={this.handleSubmit.bind(this)} id="message-form">
                            <input name="message" type="text" placeholder="Message"
                                ref={inputRef => this.input = inputRef} style={{unicodeBidi:"plaintext"}} />
                            <button type="submit"> ارسال</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default Chat;
