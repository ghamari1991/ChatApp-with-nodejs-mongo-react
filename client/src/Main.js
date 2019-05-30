import React, { Component } from 'react';
import cookie from 'react-cookies'
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import LoginAdmin from "./LoginAdmin.js"
import Login from "./Login.js";
import UserList from './UserList.js'
import Chat from "./Chat.js";
import config from './config.js'
import ChatRoom from "./ChatRoom.js"
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: null,
            isAuthenticatedAdmin: null
        };
    }
    handleLogin() {
        this.setState({
            isAuthenticated: true
        });
    }
    handleLoginAdmin() {
        this.setState({
            isAuthenticatedAdmin: true
        });
    }
    async componentDidMount() {
        const api_token = cookie.load('api_token');
        if (api_token !== undefined) {
            axios.post(`${config.server}:${config.port}/isLoggedIn`, { api_token })
                .then(response => {
                    this.setState({
                        isAuthenticated: true
                    });
                }).catch((err) => {
                    this.setState({
                        isAuthenticated: false
                    });
                })
            axios.post(`${config.server}:${config.port}/isLoggedIn`, { api_token })
                .then(response => {
                    this.setState({
                        isAuthenticatedAdmin: true
                    });
                }).catch((err) => {
                    this.setState({
                        isAuthenticatedAdmin: false
                    });
                })
        } else {
            this.setState({
                isAuthenticated: false,
                isAuthenticatedAdmin: false
            });
        }
    }
    render() {
        const { isAuthenticated ,isAuthenticatedAdmin} = this.state;
        return (
            <Switch>
                
               
                <Route path="/admin-chat/:id" component={ChatRoom} />

                <Route exact={true} path="/user-list" render={(props) =>
                    isAuthenticatedAdmin
                        ?
                        <UserList/>
                        :
                        <Redirect to={{ pathname: '/admin-login-page', state: { from: props.location } }} />
                }
                />
                <Route exact={true} path="/admin-login-page" render={(props) =>
                    isAuthenticatedAdmin
                        ?
                        <Redirect to={{ pathname: '/user-list', state: { from: props.location } }} />
                        :
                        <LoginAdmin handleLoginAdmin={this.handleLoginAdmin.bind(this)} />
                }
                />
                <Route exact={true} path="/chat-page" render={(props) =>
                    isAuthenticated
                        ?
                        <Chat />
                        :
                        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                }
                />
                <Route exact={true} path="/" render={(props) =>
                    isAuthenticated
                        ?
                        <Redirect to={{ pathname: '/chat-page', state: { from: props.location } }} />
                        :
                        <Login handelLogin={this.handleLogin.bind(this)} />
                }
                />

            </Switch>
        );
    }
}
export default Main