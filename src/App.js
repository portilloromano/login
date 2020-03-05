import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import Inside from './components/Inside';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/inside" component={Inside} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
