import {STATE_CHANGE_PASSWORD, STATE_LOGIN, STATE_PASSWORD_REQUEST, STATE_SIGNUP} from './components/AuthForm';
import GAListener from './components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from './components/Layout';
import PageSpinner from './components/PageSpinner';
import AuthPage from './pages/AuthPage';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import { PrivateRoute } from './components/privateRoute';
import './styles/reduction.scss';

const CardPage = React.lazy(() => import('./pages/CardPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const DocumentosPage = React.lazy(() => import('./pages/DocumentosPage'));
const CuentaPage = React.lazy(() => import('./pages/CuentaPage'));

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};

class App extends React.Component {
  render() {
    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_LOGIN} />
              )}
            />
            <LayoutRoute
              exact
              path="/signup"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_SIGNUP} />
              )}
            />
            <LayoutRoute
              exact
              path="/password-request"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_PASSWORD_REQUEST} />
              )}
            />
            <LayoutRoute
              exact
              path="/cambiar-password"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_CHANGE_PASSWORD} />
              )}
            />

            <MainLayout breakpoint={this.props.breakpoint}>
              <React.Suspense fallback={<PageSpinner />}>
                <PrivateRoute exact path="/" component={DashboardPage} />
                <PrivateRoute exact path="/upload" component={CardPage} />
                <PrivateRoute path="/documentos/:isFadocs?" component={DocumentosPage} />
                <PrivateRoute exact path="/cuenta" component={CuentaPage} />
              </React.Suspense>
            </MainLayout>
            <Redirect to="/" />
          </Switch>
        </GAListener>
      </BrowserRouter>
    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
