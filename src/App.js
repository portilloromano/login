import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Invitation from './components/Invitation';
import InvitationsShow from './components/InvitationsShow';
import UsersShow from './components/UsersShow';
import Page404 from './components/Page404';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/invitation" component={Invitation} />
          <Route exact path="/invitation/show" component={InvitationsShow} />
          <Route exact path="/users/show" component={UsersShow} />
          <Route component={Page404} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
