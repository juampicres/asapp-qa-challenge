import pytest
from flask import Flask
from flask_restful import Api
from user_endpoints import UserCreation, UserLogin, UserLogout

@pytest.fixture
def client():
    app = Flask(__name__)
    api = Api(app)

    # Agregar endpoints a la API
    api.add_resource(UserCreation, "/create-user")
    api.add_resource(UserLogin, "/login")
    api.add_resource(UserLogout, "/logout")

    app.testing = True
    return app.test_client()


def test_create_user(client):
    """Prueba la creación de un nuevo usuario."""
    response = client.post("/create-user", json={"username": "juampi", "password": "passw0rd"})
    assert response.status_code == 200
    assert response.data.decode() == "User created successfully"


def test_create_duplicate_user(client):
    """Username already exists."""
    client.post("/create-user", json={"username": "duplicateuser", "password": "pass123"})
    response = client.post("/create-user", json={"username": "duplicateuser", "password": "pass123"})
    assert response.status_code == 409
    assert 'Username "duplicateuser" already exists' in response.data.decode()


def test_login_success(client):
    """Valid Username."""
    client.post("/create-user", json={"username": "juampi", "password": "passw0rd"})
    response = client.post("/login", json={"username": "loginuser", "password": "securepass"})
    assert response.status_code == 200
    assert response.data.decode() == "Login succeeded."


def test_login_failure(client):
    """Prueba el inicio de sesión con credenciales incorrectas."""
    response = client.post("/login", json={"username": "nonexistent", "password": "wrongpass"})
    assert response.status_code == 401
    assert response.data.decode() == "Invalid username/password combo."


def test_logout_success(client):
    """Prueba que un usuario autenticado pueda cerrar sesión."""
    client.post("/create-user", json={"username": "logoutuser", "password": "logoutpass"})
    client.post("/login", json={"username": "logoutuser", "password": "logoutpass"})

    response = client.post("/logout", json={"username": "logoutuser"})
    assert response.status_code == 200
    assert response.data.decode() == "Logout succeeded."


def test_logout_failure(client):
    """Prueba que un usuario no autenticado no pueda cerrar sesión."""
    response = client.post("/logout", json={"username": "notlogged"})
    assert response.status_code == 400
    assert response.data.decode() == "Unable to log out user: No active session"
