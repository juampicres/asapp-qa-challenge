import React, { Component } from 'react';
import ProductCard from './ProductCard';
import config from '../../config/config';
import Cookies from 'js-cookie';

class Store extends Component {
    state = { 
        apiUrl: config['api']
    }

    componentDidMount() {
        fetch(`${this.state.apiUrl}/${Cookies.get('DLacy')}/products`)
        .then(response => response.json())
        .then(response => {
            this.setState({
                products: response
            })
        })
        .catch(() => {
            Cookies.remove('DLacy')
            window.location.reload()
        })
    }

    render() { 
        return (
            <div>{ this.state.products != null &&
                this.state.products.map((product) => (
                    <ProductCard key={product['product_name']}
                        productName={product['product_name']}
                        productDescription={product['product_descr']}
                        productStock={product['product_qty']}
                        className="product-card"
                    />
                ))
            }</div>
        );
    }
}
 
export default Store;
