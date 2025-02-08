schema = {
    'tables': {
        'users': {
            'columns': {
                'username': str,
                'password': str,
                'is_logged_in': bool
            }
        },
        'products': {
            'columns': {
                'product_name': str,
                'product_qty': int,
                'product_descr': str
            }
        },
        'cart': {
            'columns': {
                'product_name': str,
                'product_qty': int,
                "cart_owner": str
            }
        }
    }
}
