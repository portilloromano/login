import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { GiftOutlined, UserOutlined } from '@ant-design/icons';
import { localRemoveItem } from '../services/localstorage.service';

const Inside = ({ user }) => {
  const { nickname, rol } = user;

  let userRol = "user";
  if (rol === 99) {
    userRol = "admin"
  }

  const sesionClose = () => {
    localRemoveItem('jwt');
  }

  return (
    <header>
      <Navbar expand="sm">
        <Navbar.Brand id="logo">
          <img src="/img/logo.svg" alt="GeeksHubs Academy" id="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="m-auto">
            <NavDropdown title={
              <div className="item">
                <GiftOutlined className="icons" />
                  Invitations
              </div>
            } id="basic-nav-dropdown">
              <Link className="dropdown-item" to="/invitation/show">
                See Invitations
              </Link>
              <Link className="dropdown-item" to="/invitation">
                Send Invitations
              </Link>
            </NavDropdown>
            <NavDropdown title={
              <div className="item">
                <UserOutlined className="icons" />
                  Users
              </div>
            } id="basic-nav-dropdown">
              <Link className="dropdown-item" to="/users/show">
                See Users
              </Link>
            </NavDropdown>
          </Nav>
          <Nav className="ml-auto user">
            <NavDropdown title={
              <div id="user" className="item">
                <UserOutlined className="icons" />
                <span>{nickname}</span>
                <span>({userRol})</span>
              </div>
            } id="basic-nav-dropdown">
              <Link to="/" className="dropdown-item" onClick={sesionClose}>
                Cerrar Sesión
              </Link>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Inside);