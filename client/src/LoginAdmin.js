import React, { Component } from 'react';
import validator from 'validator';
import axios from 'axios';
import cookie from 'react-cookies'
import './login.css'
import config from './config.js'
class LoginAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            fields: {
                email: '',
                password: ''
            },
            errors: {},
            api_msg: null
        };
    }
    componentDidMount() {
        console.log("componentDidMount")
        const api_token = cookie.load('api_token');
        if (api_token !== undefined) {
            axios.post(`${config.server}:${config.port}/isLoggedInAdmin`,{api_token})
                .then(response => {
                    this.setState({
                        isAuthenticated: true
                    });
                }).catch((err) => {
                    this.setState({
                        isAuthenticated: false
                    });
                })
        } else {
            this.setState({
                isAuthenticated: false
            });
        }
    }
    handleValidation(callback) {
        let { fields } = this.state;
        let errors = {};
        let formIsValid = true;
        // Email
        if (validator.isEmpty(fields.email.trim())) {
            formIsValid = false;
            errors["email"] = "فیلد ایمیل نمیتواند خالی بماند";
        } else if (!validator.isEmail(fields.email)) {
            formIsValid = false;
            errors["email"] = "فرمت ایمیل اشتباه است";
        }
        // password
        if (validator.isEmpty(fields.password)) {
            formIsValid = false;
            errors["password"] = "فیلد پسورد نمیتواند خالی بماند";
        } else if (!validator.isLength(fields.password, { min: 8, max: undefined })) {
            formIsValid = false;
            errors["password"] = "پسورد نمی تواند کمتر از 8 کاراکتر باشد";
        }
        this.setState({ errors }, () => {
            return callback(formIsValid)
        });
    }
    handleChange(event) {
        let fields = this.state.fields;
        let target = event.target;
        fields[target.name] = target.value;
        this.setState({ fields });
    }
    handleRequest() {
        const { email, password } = this.state.fields;
        const requestBody = {
            email,
            password
        };
        axios.post(`${config.server}:${config.port}/loginAdmin`, requestBody)
            .then(response => {
                let expires = new Date();
                expires.setDate(expires.getDate() + 2);
                cookie.save('api_token', response.data.apiToken, {
                    path: '/',
                    expires
                });
                console.log();
                this.props.handleLoginAdmin();
            })
            .catch(error => {
                if (error && error.response && error.response.data)
                    this.setState({ api_msg: error.response.data.msg });
                console.log(error)
            })
    }
    handleSubmit(event) {
        event.preventDefault();
        this.handleValidation((valid) => {
            if (valid)
                this.handleRequest()
        })
    }
    render() {
        const { email, password } = this.state.fields;
        const { errors, api_msg } = this.state;
        console.log("render")
        return (
            <form onSubmit={this.handleSubmit.bind(this)} className="form-page">
                <div className="caption">فرم ورود</div>
                <div className="form-item">
                    <label className="lable-form">ایمیل </label>
                    <input
                        type="text"
                        className="input-form" style={{ textAlign: "center", unicodeBidi: 'plaintext' }}
                        name="email"
                        value={email}
                        onChange={this.handleChange.bind(this)}
                        placeholder="ایمیل خود را وارد کنید" />
                    <span className="span-form" style={{ display: errors["email"] ? 'block' : 'none' }}>{errors["email"]}</span>
                </div>
                <div className="form-item">
                    <label className="lable-form">کلمه عبور  </label>
                    <input
                        type="password"
                        className="input-form"
                        name="password"
                        value={password}
                        onChange={this.handleChange.bind(this)}
                        placeholder="کلمه عبور خود را وارد کنید"  autoComplete="true"/>
                    <span className="span-form" style={{ display: errors["password"] ? 'block' : 'none' }}>{errors["password"]}</span>
                </div>
                <div className="form-item" style={{ marginTop: 50 }}>
                    <button className="button-form" type="submit">ورود</button>
                </div>
                <div className="form-item">
                    <ul className=" " style={{ display: api_msg ? 'block' : 'none', listStyleType: 'none' }} role="alert">
                        <li>{api_msg}</li>
                    </ul>
                </div>
            </form>
        );
    }
}
export default LoginAdmin;