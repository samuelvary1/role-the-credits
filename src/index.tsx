import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';
import { ErrorBoundary } from './components';
import Layout from './views/Layout/Layout';
import { RouteComponentProps, Switch, Route, BrowserRouter } from 'react-router-dom';

const render = (Component: React.ComponentType<RouteComponentProps<{ view: string }>>) => {
  ReactDOM.render(
    <ErrorBoundary>
      <BrowserRouter>
      <Switch>                        
        <Route component={Component} />
      </Switch>
      </BrowserRouter>
    </ErrorBoundary>,
    document.querySelector('#root')
  );
};

render(Layout);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
