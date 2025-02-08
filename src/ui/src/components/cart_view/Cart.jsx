import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import BuyPopUp from './BuyPopUp';
import Cookies from 'js-cookie';
import config from '../../config/config';

class Cart extends Component {

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this)
    }

    state = {  
        dialog: false,
        buyResponseCode: 0,
        apiUrl: config['api'],
    }

    componentDidMount() {
        const username = Cookies.get('DLacy')
        this.getCart(username)
    }

    getCart(username) {
        fetch(`${this.state.apiUrl}/${username}/products/cart`)
        .then(response => response.json())
        .then(response => {
            this.setState({
                cart: response
            })
            return response
        }).then(response => {
            if (response != null) {
                for (var i = 0 ; i < response.length ; i++) {
                    this.getProduct(username, response[i].product_name)
                }
            }
        })
    }

    getProduct(username, product) {
        fetch(`${this.state.apiUrl}/${username}/products/${product}`)
        .then(response => response.json())
        .then(response => {
            this.setState({
                [product]: response.product_qty
            })
        })
    }

    buy() {
        const username = Cookies.get('DLacy')
        const opts = {
            'username': username
        }
        fetch(`${this.state.apiUrl}/${username}/products/cart/checkout`, {
            method: 'post',
            body: JSON.stringify(opts),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            this.setState({
                buyResponseCode: response.status,
                dialog: true
            })
        })
    }

    remove(product) {
        const username = Cookies.get('DLacy')
        const opts = {
            'product_name': product,
            'username': username
        }
        fetch(`${this.state.apiUrl}/${username}/products/cart/${product}/remove`, {
            method: 'post',
            body: JSON.stringify(opts),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            this.getCart(username)
        })
    }

    handleChange(e) {
        // console.log(e.target.value)
    }

    backToStore() {
        window.location.reload()
    }

    render() {
        return (  
            <div>
                {this.state.dialog &&
                    <BuyPopUp open={true} code={this.state.buyResponseCode}/>
                }
                <Paper className="cart-table">
                    <Table className="cart-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Products</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">In Stock</TableCell>
                                <TableCell align="center">Remove</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.cart != null && this.state.cart.map(product => (
                                <TableRow key={`row_${product.product_name}`} className="cart-table-row">
                                    <TableCell>{product.product_name}</TableCell>
                                    {product.product_qty <= this.state[product.product_name] ?
                                    <React.Fragment>
                                        <TableCell className="product-info" align="center">{product.product_qty}</TableCell>
                                        <TableCell className="product-info" align="center">{this.state[product.product_name]}</TableCell>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <TableCell className="product-info" align="center">{product.product_qty}</TableCell>
                                        <TableCell className="product-info" align="center">
                                            <Button onClick={() => this.remove()} color="secondary" variant="contained">OUT OF STOCK</Button>
                                        </TableCell>
                                    </React.Fragment>
                                    }
                                    <TableCell align="center"><Button onClick={() => this.remove(product.product_name)} color="secondary" variant="contained">x</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
                <br /><br />
                <div className="buy-button">
                    {this.state.cart !== null && this.state.cart !== undefined ?
                        <Button onClick={() => this.buy()} color="secondary" variant="contained">
                            BUY!
                        </Button>
                    :
                    <Button onClick={() => this.backToStore()} color="secondary" variant="contained">
                        OH NO YOUR CART IS EMPTY
                    </Button>
                    }
                </div>
            </div>
        );
    }
}
 
export default Cart;
