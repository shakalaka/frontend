import React, { Component } from 'react';
import 'sass/app.scss';
import RouterOutlet from 'router/RouterOutlet'


class App extends Component {
  render() {
    return (
      <div id="App">
          <main role="main" className="container mt-5">
              <form className="md-5">
                  <input type="text"/>
              </form>
              <RouterOutlet/>
          </main>
      </div>
    );
  }
}

export default App;
