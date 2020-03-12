import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu } from 'antd';
import {GiftOutlined} from '@ant-design/icons';

const { SubMenu } = Menu;

const Inside = ({ user }) => {
  const { nickname, rol } = user;

  let userRol = "user";
  if (rol === 99) {
    userRol = "admin"
  }

  return (
    <header>
      <img src="/logo.svg" alt="GeeksHubs Academy" id="logo" />
      <div id="menu">
        <Menu mode="horizontal">
          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                <GiftOutlined />
                Invitations
            </span>
            }
          >
            <Menu.Item key="seeInvitations">
              <Link to="/invitation/show">See Invitations</Link>
            </Menu.Item>
            <Menu.Item key="sendInvitation">
              <Link to="/invitation">Send Invitations</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
      <div id="user">
        <p>{nickname}</p>
        <p>({userRol})</p>
      </div>
    </header>
  );
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Inside);