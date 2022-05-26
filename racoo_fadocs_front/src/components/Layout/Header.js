import { createBrowserHistory } from 'history';
import React from 'react';
import {
  MdClearAll,
  MdExitToApp,
  MdHelp,
  MdSettingsApplications,
} from 'react-icons/md';
import {
  Button,
  ListGroup,
  ListGroupItem,
  Nav,
  Navbar,
  NavItem,
  NavLink,
  Popover,
  PopoverBody,
  UncontrolledPopover,
} from 'reactstrap';
import { connect } from 'react-redux';

import Avatar from '../../components/Avatar';
import { UserCard } from '../../components/Card';
import StoredFiles from '../../components/StoredFiles';
import { authenticationService } from '../../services/authentication.service';
import bn from '../../utils/bemnames';

const bem = bn.create('header');

/**
 * Componente Header
 */
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenNotificationPopover: false,
      isNotificationConfirmed: false,
      isOpenUserCardPopover: false,
      currentUser: {},
      history: {},
      navigateToCuenta: false,
    };
  };

  componentDidMount() {
    const history = createBrowserHistory();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.setState({
      currentUser: user ? user : {},
      history: history,
    });
  };

  toggleNotificationPopover = () => {
    this.setState({
      isOpenNotificationPopover: !this.state.isOpenNotificationPopover,
    });

    if (!this.state.isNotificationConfirmed) {
      this.setState({ isNotificationConfirmed: true });
    }
  };

  toggleUserCardPopover = () => {
    this.setState({
      isOpenUserCardPopover: !this.state.isOpenUserCardPopover,
    });
  };


  handleSidebarControlButton = event => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
  };

  handleLogout = async () => {
    authenticationService.logout();
    this.state.history.go('/login');
  };

  render() {
    const { isNotificationConfirmed } = this.state;

    return (
      <Navbar light expand className={bem.b('bg-white')}>
        <Nav navbar className='mr-2'>
          <Button outline onClick={this.handleSidebarControlButton}
                  style={{ color: '#434343', border: '2px solid #434343' }}>
            <MdClearAll size={25} />
          </Button>
        </Nav>

        <Nav navbar className={bem.e('nav-right')}>
          <StoredFiles />

          <NavItem className='d-inline-flex'>
            <NavLink id='Popover1' className='position-relative'>
              {isNotificationConfirmed ? (
                <MdHelp
                  size={25}
                  className='can-click'
                  onClick={this.toggleNotificationPopover}
                />
              ) : (
                <MdHelp
                  size={25}
                  className='can-click animated swing infinite'
                  onClick={this.toggleNotificationPopover}
                />
              )}
            </NavLink>
            <Popover
              placement='bottom'
              isOpen={this.state.isOpenNotificationPopover}
              toggle={this.toggleNotificationPopover}
              target='Popover1'
            >
              <PopoverBody>
                Lorem ipsum dolor
              </PopoverBody>
            </Popover>
          </NavItem>

          <NavItem>
            <NavLink id='Popover2'>
              <Avatar
                onClick={this.toggleUserCardPopover}
                className='can-click'
                src={this.props.profileImage}
              />
            </NavLink>

            <UncontrolledPopover
              className={bem.e('user-popover')}
              placement='bottom-end'
              target='Popover2'
              trigger='legacy'
            >
              <PopoverBody>
                <UserCard
                  avatar={this.props.profileImage}
                  className='border-light'
                  subtitle={this.state.currentUser ? this.state.currentUser.email : ''}
                  title={this.state.currentUser ? this.state.currentUser.usuario : ''}
                >
                  <ListGroup flush>
                    <ListGroupItem tag='button' action className='border-light'>
                      <MdSettingsApplications /> Ajustes
                    </ListGroupItem>
                    <ListGroupItem tag='button' action className='border-light'>
                      <MdHelp /> Ayuda
                    </ListGroupItem>
                    <ListGroupItem tag='button' action className='border-light' onClick={this.handleLogout}>
                      <MdExitToApp /> Cerrar Sesión
                    </ListGroupItem>
                  </ListGroup>
                </UserCard>
              </PopoverBody>
            </UncontrolledPopover>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default connect(
  ({ user }, props) => ({ ...props, profileImage: user.profileImage })
)(Header);

