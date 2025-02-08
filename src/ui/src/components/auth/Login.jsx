import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import config from '../../config/config';
import Cookies from 'js-cookie';
import Register from './Register';
import BadLoginAlert from './BadLoginAlert';

class Login extends Component {
    state = {  
        register: false,
        badlogin: false,
        apiUrl: config['api'],
    }

    login() {
        const opts = {
            "username": document.getElementById("username").value,
            "password": document.getElementById("password").value
        }
        fetch(this.state.apiUrl + '/users/login', {
            method: 'post',
            body: JSON.stringify(opts),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200) {
                Cookies.set("DLacy", opts['username'])
                this.setState({
                    open: false
                })
                window.location.reload();
            } else {
                this.setState({
                    badlogin: true
                })
            }
        })
    }

    initiateRegister() {
        this.setState({
            register: true
        })
    }

    render() { 
        return (  
            <Card className="login-card">
            {this.state.register &&
                <Register open={true} />
            }
            {this.state.badlogin &&
                <BadLoginAlert open={true}/>
            }
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                            Please Login
                        </Typography>
                        <TextField
                            id="username"
                            label="Username"
                            fullWidth={true}
                        />
                        <TextField
                            id="password"
                            label="Password"
                            fullWidth={true}
                            type="password"
                            onKeyDown={(event) => {
                                event.key === "Enter" &&
                                    this.login()
                            }}
                        />
                    </CardContent>
                </CardActionArea>
                    <Button className="auth-button" onClick={() => this.login()} size="small" color="primary">
                        Log In
                    </Button>
                    <Button className="auth-button" onClick={() => this.initiateRegister()} size="small" color="primary">
                        Register
                    </Button>
            </Card>
        );
    }
}
 
export default Login;