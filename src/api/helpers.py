import os
from flask_swagger_ui import get_swaggerui_blueprint
from yaml import Loader, load

from data import swagger_data


def is_logged_in(db, username):
    user = db.search(table=db.users, query=(db.query.username == username))
    if user:
        is_logged_in = user[0].get('is_logged_in')
    else:
        is_logged_in = False

    return is_logged_in


def load_swagger_blueprint():
    swagger_url = swagger_data['SWAGGER_URL']
    swagger_config_file = swagger_data['SWAGGER_CONFIG_FILE']
    swagger_path = os.path.join(os.path.dirname(__file__), swagger_config_file)

    swagger_yaml = load(open(swagger_path, 'r'), Loader=Loader)

    blueprint = get_swaggerui_blueprint(
        swagger_url, swagger_path,
        config={'spec': swagger_yaml}
    )

    return {'blueprint': blueprint, 'swagger_url': swagger_url}
