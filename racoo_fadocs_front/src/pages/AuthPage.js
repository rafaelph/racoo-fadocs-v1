import React from 'react';
import { Card, Col, Row } from 'reactstrap';

import AuthForm from '../components/AuthForm';
import { authenticationService } from '../services/authentication.service';

class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    // redirect to home if already logged in
    if (authenticationService.currentUserValue && authenticationService.currentUserValue.result) {
      this.props.history.push('/');
    }
  }

  handleLogoClick = () => {
    this.props.history.push('/');
  };

  render() {
    return (
      <Row
        style={{
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Col md={6} lg={4}>
          <Card body>
            <AuthForm
              onLogoClick={this.handleLogoClick}
              history={this.props.history}
              location={this.props.location}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default AuthPage;
