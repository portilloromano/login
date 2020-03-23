import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { localRemoveItem } from '../services/localstorage.service';
import VerticalMenu from './VerticalMenu';

const Header = ({ user }) => {
  const [state, setState] = useState({
    collapsed: true,
  });

  const { nickname, rol } = user;
  const { SubMenu } = Menu;

  let userRol = "user";
  if (rol === 99) {
    userRol = "admin"
  }

  const toggleCollapsed = () => {
    setState({
      collapsed: !state.collapsed,
    });
  };

  const sesionClose = () => {
    localRemoveItem('jwt');
  }

  return (
    <Fragment>
      <header>
        <div id="logo-button">
          <img src="/img/logo.svg" alt="GeeksHubs Academy" id="logo" />

          <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
            {React.createElement(state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
          </Button>
        </div>

        <Menu
          id="user"
          mode="horizontal"
        >
          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                <UserOutlined className="icons" />
                <div className="item">
                  <span>{nickname}</span>
                  <span>({userRol})</span>
                </div>
              </span>
            }
          >
            <Menu.Item key="logout">
              <Link to="/" onClick={sesionClose}>
                Log Out
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </header>
      <VerticalMenu state={state} />
    </Fragment>
  );
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Header);