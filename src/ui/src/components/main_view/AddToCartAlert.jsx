import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';


class AddToCartAlert extends Component {
    state = { 
        open: true
    }

    componentWillReceiveProps() {
        this.setState({
            open: this.props.open
        })
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
                    data-test-name="added-to-cart-alert"
                    ContentProps={{
                        'aria-describedby': 'snackbar-fab-message-id',
                    }}
                    message={<span id="snackbar-fab-message-id">Product Added to Cart</span>}
                    action={
                        <Button onClick={() => this.close()} color="inherit" size="small">
                            Close
                        </Button>
                    }
                />
            </div>
        );
    }
}
 
export default AddToCartAlert;