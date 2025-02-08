import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

class BadLoginAlert extends Component {
    state = { 
        open: true
    }

    close() {
        this.setState({
            open: false
        })
    } 

    render() { 
        return (  
            <div>
                <Snackbar
                    open={this.state.open}
                    color="blue"
                    autoHideDuration={4000}
                    data-test-name="bad-login-alert"
                    ContentProps={{
                        'aria-describedby': 'snackbar-fab-message-id',
                    }}
                    message={<span className="error_message" id="snackbar-fab-message-id">Incorrect Username or Password</span>}
                    action={
                        <Button className="close_button" onClick={() => this.close()} color="inherit" size="small">
                            Close
                        </Button>
                    }
                />
            </div>
        );
    }
}
 
export default BadLoginAlert;