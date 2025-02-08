import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import config from '../../config/config';

class Register extends Component {

    constructor() {
        super();
        this.state = { 
            open: true,
            apiUrl: config['api'],
        }
        this.setState = this.setState.bind(this);
    }

    componentWillReceiveProps() {
        this.setState({
            open: this.props.open
        })
    }

    register() {
        const opts = {
            "username": document.getElementById("register-username").value,
            "password": document.getElementById("register-password").value
        }
        fetch(this.state.apiUrl + '/users/register', {
            method: 'post',
            body: JSON.stringify(opts),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            this.setState({
                open: false
            })
            window.location.reload();
        })
    }

    close() {
        this.setState({
            open: false
        })
    }

    render() { 
        return (
            <React.Fragment>
                <Dialog
                    open={this.state.open}
                    onClose={() => this.close()}
                >
                    <DialogTitle>Thank you!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please insert Username and Password
                        </DialogContentText>
                        <TextField
                            id="register-username"
                            label="Username"
                            fullWidth={true}
                        />
                        <TextField
                            id="register-password"
                            label="Password"
                            fullWidth={true}
                            type="password"
                            onKeyDown={(event) => {
                                event.key === "Enter" &&
                                    this.register()
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button className="auth-button" onClick={() => this.register()} color="primary">
                            Register
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}
 
export default Register;