import React from 'react';
import { Switch } from 'react-router-dom';

import Router from './Router';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

const Routes: React.FC = () => (
  <Switch>
    <Router path="/" exact component={SignIn} />

    <Router path="/signup" component={SignUp} />
    <Router path="/forgot" component={ForgotPassword} />
    <Router path="/reset" component={ResetPassword} />

    <Router path="/dashboard" component={Dashboard} isPrivate />
    <Router path="/profile" component={Profile} isPrivate />
  </Switch>
);

export default Routes;
