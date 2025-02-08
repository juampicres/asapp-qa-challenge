from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from helpers import load_swagger_blueprint
from db.db import DataBase

from data import endpoints
from product_endpoints import ProductInfo, ProductsInfo, \
    AddProductToCart, CheckoutCart, CartInfo, RemoveProductFromCart
from user_endpoints import UserCreation, UserLogin, UserLogout
from db.default_inventory import default_inventory


db_session = DataBase()
app = Flask(__name__)
api = Api(app)
CORS(app, allow_headers=[
    "Content-Type", "Authorization", "Access-Control-Allow-Origin"],
    supports_credentials=True)
blueprint_data = load_swagger_blueprint()
app.register_blueprint(blueprint_data['blueprint'],
                       url_prefix=blueprint_data['swagger_url'])


if __name__ == '__main__':
    api.add_resource(UserCreation, endpoints['REGISTER_USER'])
    api.add_resource(UserLogin, endpoints['LOGIN_USER'])
    api.add_resource(UserLogout, endpoints['LOGOUT_USER'])
    api.add_resource(ProductInfo, endpoints['GET_PRODUCT'])
    api.add_resource(ProductsInfo, endpoints['GET_PRODUCTS'])
    api.add_resource(AddProductToCart, endpoints['ADD_TO_CART'])
    api.add_resource(CartInfo, endpoints['GET_CART'])
    api.add_resource(CheckoutCart, endpoints['CHECKOUT_CART'])
    api.add_resource(RemoveProductFromCart, endpoints['REMOVE_FROM_CART'])

    db_session.purge_table(db_session.users)
    db_session.purge_table(db_session.cart)
    db_session.purge_table(db_session.products)

    for product in default_inventory:
        db_session.insert(db_session.products, product)

    app.run(debug=True, host='0.0.0.0')
