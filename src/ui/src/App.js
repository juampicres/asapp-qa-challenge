import React, { Component } from 'react';
import Store from './components/main_view/Store'
import Cart from './components/cart_view/Cart';
import Login from './components/auth/Login';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Cookies from 'js-cookie';
import config from './config/config';
import './App.css';

class App extends Component {
  state = {  
    view: "store",
    apiUrl: config['api']
  }

  logout() {
    const opts = {
      "username": Cookies.get('DLacy')
    }
    fetch(this.state.apiUrl + '/users/logout', {
        method: 'post',
        body: JSON.stringify(opts),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => {
      Cookies.remove('DLacy')
      window.location.reload()
    })
  }

  setTab(value) {
    this.setState({
      view: value
    })
  }

  render() { 
    return (  
      <div className="App">
        {Cookies.get('DLacy') &&
          <React.Fragment>
            <AppBar position="static">
              <Tabs value={this.state.view}>
                <Tab value="store" className="nav-tab" onClick={() => this.setTab("store")} label="Store" />
                <Tab value="cart" className="nav-tab" onClick={() => this.setTab("cart")} label="Cart" />
                <Tab value="logout" className="nav-tab" onClick={() => this.logout()} label="Log Out" />
              </Tabs>
            </AppBar>
            <header className="App-header">
              {this.state.view === "store" &&
                <Store />
              }
              {this.state.view === "cart" &&
                <Cart />
              }
            </header>
          </React.Fragment>
        }
        {!Cookies.get('DLacy') &&
          <React.Fragment>
            <AppBar position="static">
              <Tabs />
            </AppBar>
            <header className="App-header">
              <Login />
            </header>
          </React.Fragment>
        }
    </div>
    );
  }
}

export default App;
