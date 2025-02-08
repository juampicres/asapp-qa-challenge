import React, { Component } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddToCartAlert from './AddToCartAlert';
import imagePen from '../resources/pen.jpg';
import imageStickers from '../resources/stickers.jpg'
import imageWaterBottle from '../resources/waterbottle.jpg'
import config from '../../config/config';
import Cookies from 'js-cookie';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const styles = {
    list: {
      height: "350px"
    }
  };

class ProductCard extends Component {
    quantity= '';

    useStyles = makeStyles({
        card: {
          maxWidth: 345,
        },
        media: {
          height: 140,
        },
      });
    
    state = {  
        alert: false,
        apiUrl: config['api'],
        quantity: ''
    }

    buy(product) {
        const quantity = document.getElementById(`quantity-${product}`).value
        const opts = {
            "quantity": quantity
        }
        fetch(`${this.state.apiUrl}/${Cookies.get('DLacy')}/products/${product}/add`, {
            method: 'post',
            body: JSON.stringify(opts),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        this.setState({
            alert: true
        })
    }

    imageValidation(product) {
        if(product === "ASAPP Pens") {
            return imagePen;
        } else if(product === "ASAPP Stickers") {
            return imageStickers;
        } else if(product === "ASAPP Water Bottle") {
            return imageWaterBottle;
        }
    }

    handleChange = event => {
        this.setState({
            quantity: event.target.value
        });
    };

    render() {
        const { classes } = this.props;
        return ( 
            <Card className="product-card" data-test-name="product-card">
                {this.state.alert &&
                    <AddToCartAlert open={true} />
                }
                <CardActionArea>
                    <CardMedia
                        className="product-media"
                        component="img"
                        // className={this.useStyles.media}
                        src={this.imageValidation(this.props.productName)}
                        title="product"
                    />
                    <CardContent className="product-card-content">
                        <Typography gutterBottom variant="h4" component="h2" data-test-name="product-title">
                            {this.props.productName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p" data-test-name="product-desc">
                            {this.props.productDescription}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button onClick={() => this.buy(this.props.productName)} size="small" color="primary" data-test-name="add-to-cart-button">
                        Add to Cart
                    </Button>

                    <Select id={`quantity-${this.props.productName}`} value={this.state.quantity} onChange={this.handleChange}
                    MenuProps={{ classes: {list:classes.list}}} >
                        {Array.apply(null, {length: this.props.productStock + 1}).map((e, i) => (
                            <MenuItem key={i} value={i} disabled={i === 0} hidden={i === 0}>{i}</MenuItem>
                            ))}
                    </Select>

                    {this.props.productStock > 0 &&
                        <Button data-test-name="stock-button" size="small" color="primary">
                            In Stock!
                        </Button>
                    }
                    {this.props.productStock <= 0 &&
                        <Button size="small" color="secondary" data-test-name="out-of-stock-label">
                            Out of Stock!
                        </Button>
                    }
                </CardActions>
            </Card>
        );
    }
}
 
export default withStyles(styles)(ProductCard);