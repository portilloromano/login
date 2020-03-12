import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './components/Login';
import Inside from './components/Header';
import Invitation from './components/Invitation';
import InvitationsShow from './components/InvitationsShow';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/inside" component={Inside} />
          <Route exact path="/invitation" component={Invitation} />
          <Route exact path="/invitation/show" component={InvitationsShow} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
