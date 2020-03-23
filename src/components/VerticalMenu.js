import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
  PieChartOutlined,
  GiftOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;

const VerticalMenu = ({ state, ...props }) => {
  const handleClick = e => {
    // switch (e.key) {
    //   case 'dashboard':
    //     props.history.push("/dashboard");
    //     break;
    //   case 'invitationShow':
    //     props.history.push("/invitation/show");
    //     break;
    //   case 'invitationSend':
    //     props.history.push("/invitation");
    //     break;
    //   case 'user':
    //     props.history.push("/users/show");
    //     break;
    //   default:
    //     break;
    // }
  }

  return (
    <div id="vertical-menu">
      <Menu
        defaultSelectedKeys={'dashboard'}
        // defaultOpenKeys={['sub1']}
        mode="inline"
        theme="light"
        inlineCollapsed={state.collapsed}
        onClick={handleClick}
      >
        <Menu.Item key="dashboard">
          <PieChartOutlined />
          {/* <Link to="/dashboard"> */}
          <span>Dashboard</span>
          {/* </Link> */}
        </Menu.Item>
        <SubMenu
          key="sub1"
          title={
            <span>
              <GiftOutlined />
              <span>Invitations</span>
            </span>
          }
        >
          <Menu.Item key="invitationShow">
            {/* <Link to="/invitation/show"> */}
            See Invitations
          {/* </Link> */}
          </Menu.Item>
          <Menu.Item key="invitationSend">
            {/* <Link to="/invitation"> */}
            Send Invitations
          {/* </Link> */}
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="user">
          <UserOutlined />
          {/* <Link to="/users/show"> */}
          <span>Users</span>
          {/* </Link> */}
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default VerticalMenu;