import React from 'react';
import {
  MdCloudUpload,
  MdHome,
  MdFolder,
  MdAccountBox,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import {
  Nav,
  Navbar,
  NavItem,
  NavLink as BSNavLink,
} from 'reactstrap';

import SourceLink from '../SourceLink';
import bn from '../../utils/bemnames';

import upload from '../../assets/img/fadocs/upload.png';
import home from '../../assets/img/fadocs/home.png';
import misDocs from '../../assets/img/fadocs/misDocs.png';
import user from '../../assets/img/users/user.png';
import logo200Image from '../../assets/img/logo/logo_200.png';


const sidebarBackground = {
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const navItems = [
  { to: '/', name: 'Inicio', exact: true, Icon: MdHome, pathImage: home },
  { to: '/upload', name: 'Subir', exact: false, Icon: MdCloudUpload, pathImage: upload },
  { to: '/documentos/drive', name: 'Mis Documentos', exact: false, Icon: MdFolder, pathImage: misDocs },
  { to: '/documentos/fadocs', name: 'Mis fadocs', exact: false, Icon: MdFolder, pathImage: misDocs },
  { to: '/cuenta', name: 'Mi Cuenta', exact: false, Icon: MdAccountBox, pathImage: user },
];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  state = {
    isOpenComponents: true,
    isOpenContents: true,
    isOpenPages: true,
  };

  render() {
    return (
      <aside className={bem.b()} id='123'>
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Navbar>
            <SourceLink className='navbar-brand d-flex'>
              <img
                src={logo200Image}
                width='40'
                height='30'
                className='pr-2'
                alt=''
              />
              <span className='text-white'>
                faDocs
                {/* Reduction <FaGithub /> */}
              </span>
            </SourceLink>
          </Navbar>
          <Nav vertical>
            {navItems.map(({ to, name, exact, Icon, pathImage }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className='text-uppercase'
                  tag={NavLink}
                  to={to}
                  activeClassName='active'
                  exact={exact}
                >
                  <img
                    src={pathImage}
                    className={bem.e('nav-item-icon')}
                    alt='category'
                  />
                  <span>{name}</span>
                </BSNavLink>
              </NavItem>
            ))}
          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
