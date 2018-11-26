import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Tasks from '@/Tasks';
import Error404 from '@/Error404';
class RouterOutlet extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Tasks} exact={true}/>
          <Route component={Error404}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default RouterOutlet;
