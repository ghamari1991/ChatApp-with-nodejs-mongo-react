import React, { Component } from 'react';
import cookie from 'react-cookies';
import socketIOClient from 'socket.io-client'
import "./chat.css"
import config from "./config.js"

class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
          messages:[],
          room:this.props.match.params.id     
        }
        
    }
    componentDidMount() {
        const room=this.state.room
        const socket = socketIOClient(`${config.server}:${config.port}`);
        const api_token = cookie.load('api_token');
        socket.on('connect', function () {
            socket.emit('join', { api_token ,room:room},function (err) {
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
        const room=this.state.room
        const socket = socketIOClient(`${config.server}:${config.port}`);
        const api_token = cookie.load('api_token');
        e.preventDefault();
        socket.emit('createMessageAdmin', {
            message: this.input.value, api_token: api_token,room:room
        })
        this.input.value=""
    }
    render() {
        console.log(this.state.room)
        return (
            <div className="chat">
                <div className="chat__sidebar">
                    <h3> اعضا</h3>
                    <div id="users"></div>
                </div>
                <div className="chat__main">
                    <ol id="messages" className="chat__messages">
                    {this.state.messages.map((message,key)=>{
                         return <li key={key} style={{padding:10,backgroundColor:"gray",margin:3}}>{message}</li>
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
export default ChatRoom;
