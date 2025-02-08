endpoints = {
    "REGISTER_USER": "/users/register",
    "LOGIN_USER": "/users/login",
    "LOGOUT_USER": "/users/logout",
    "GET_PRODUCTS": "/<string:username>/products",
    "GET_PRODUCT": "/<string:username>/products/<string:product_name>",
    "ADD_TO_CART": "/<string:username>/products/<string:product_name>/add",
    "GET_CART": "/<string:username>/products/cart",
    "CHECKOUT_CART": "/<string:username>/products/cart/checkout",
    "REMOVE_FROM_CART": "/<string:username>/products/"
                        "cart/<string:product_name>/remove"
}

swagger_data = {
    "SWAGGER_URL": "/api/docs",
    "SWAGGER_CONFIG_FILE": "api_docs.yaml",
}
