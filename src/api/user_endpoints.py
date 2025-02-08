from flask_restful import Resource, reqparse

from db.db import DataBase

db_session = DataBase()


class UserCreation(Resource):
    def post(self):
        # create new user
        parser = reqparse.RequestParser()
        parser.add_argument('username')
        parser.add_argument('password')
        args = parser.parse_args()
        needed_username = args['username']

        existing_users = db_session.search(
            db_session.users,
            query=(
                db_session.query.username == needed_username
            )
        )
        if existing_users:
            return 'Username "{}" already exists'.format(needed_username), 409

        new_user = {
            'username': needed_username,
            'password': args['password'],
            'is_logged_in': False
        }

        db_session.insert(db_session.users, new_user)

        return 'User created successfully', 200


class UserLogin(Resource):
    def post(self):
        # login as user
        parser = reqparse.RequestParser()
        parser.add_argument('username')
        parser.add_argument('password')
        args = parser.parse_args()
        username = args['username']
        user = db_session.search(
            db_session.users,
            (db_session.query.username == username)
        )
        if user:
            user = user[0]
            if user.get('password') == args['password']:
                db_session.update(
                    table=db_session.users,
                    update={'is_logged_in': True},
                    query=(db_session.query.username == username)
                )
                return 'Login succeeded.', 200

        return 'Invalid username/password combo.', 401


class UserLogout(Resource):
    def post(self):
        # logout user
        parser = reqparse.RequestParser()
        parser.add_argument('username')
        args = parser.parse_args()
        username = args['username']
        user = db_session.search(
            db_session.users,
            (
                (db_session.query.username == username) &
                (db_session.query.is_logged_in == True)  # noqa: E712
            )
        )
        if user:
            db_session.update(
                table=db_session.users, update={'is_logged_in': False},
                query=(db_session.query.username == username)
            )
            return 'Logout succeeded.', 200

        return 'Unable to log out user: No active session', 400
