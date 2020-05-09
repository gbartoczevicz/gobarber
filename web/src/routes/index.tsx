import React from 'react';
import { Switch } from 'react-router-dom';

import Router from './Router';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';

const Routes: React.FC = () => (
  <Switch>
    <Router path="/" exact component={SignIn} />
    <Router path="/signup" component={SignUp} />
    <Router path="/dashboard" component={Dashboard} isPrivate />
  </Switch>
);

export default Routes;
