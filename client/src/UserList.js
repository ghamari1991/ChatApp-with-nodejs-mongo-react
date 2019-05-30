import React, { Component } from 'react';
import cookie from 'react-cookies'
import './App.css';
import axios from 'axios';
import {Link} from "react-router-dom";
import config from './config.js'
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: []
    }
  }
  componentDidMount() {
    const api_token = cookie.load('api_token');
    axios.post(`${config.server}:${config.port}/get-user-list`, { api_token })
      .then(response => {
        this.setState({ userList: response.data.users });
      })
      .catch(error => {
        console.log("userlist component err")
      })
  }
  render() {
    return (
      <div>
        <ol>
          {
            this.state.userList.map((user) => {

              return <li key={user._id}style={{ padding: 10, margin: 10, backgroundColor: "gray", textAlign: "center", borderRadius: 5 }}><Link to={`/admin-chat/${user._id}`}>{user.AccountName}</Link></li>
            })
          }
        </ol>
      </div>
    );
  }
}
export default UserList;
