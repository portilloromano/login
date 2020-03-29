import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Menu } from 'antd';
import {
  PieChartOutlined,
  GiftOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;

const VerticalMenu = ({ setVerticalMenu, verticalMenu, ...props }) => {
  const { defaultSelectedKeys, inlineCollapsed } = verticalMenu;

  const isSM = useMediaQuery({ query: '(min-width: 544px)' })

  const handleClick = e => {
    setVerticalMenu(
      {
        ...verticalMenu,
        defaultSelectedKeys: e.key
      });

    switch (e.key) {
      case 'dashboard':
        props.history.push("/dashboard");
        break;
      case 'invitationShow':
        props.history.push("/invitation/show");
        break;
      case 'invitationSend':
        props.history.push("/invitation");
        break;
      case 'user':
        props.history.push("/users/show");
        break;
      default:
        break;
    }
  }

  return (
    <Fragment>
      {isSM || !inlineCollapsed ?
        <div>
          <div id="space-menu-vertical"
            style={{
              float: 'left',
              width: inlineCollapsed ? '80px' : '200px',
              transition: 'all .2s'
            }}>
            <p></p>
          </div>
          <div id="vertical-menu">
            <Menu
              defaultSelectedKeys={defaultSelectedKeys}
              // defaultOpenKeys={['sub1']}
              mode="inline"
              theme="light"
              inlineCollapsed={inlineCollapsed}
              onClick={handleClick}
            >
              <Menu.Item key="dashboard">
                <PieChartOutlined />
                <span>Dashboard</span>
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
                  See Invitations
          </Menu.Item>
                <Menu.Item key="invitationSend">
                  Send Invitations
          </Menu.Item>
              </SubMenu>
              <Menu.Item key="user">
                <UserOutlined />
                <span>Users</span>
              </Menu.Item>
            </Menu>
          </div>
        </div>
        : null}
    </Fragment>
  );
}

const mapStateToProps = state => ({
  verticalMenu: state.verticalMenu
});

const mapDispatchToTops = dispatch => ({
  setVerticalMenu(verticalMenu) {
    dispatch({
      type: 'VERTICAL_MENU',
      verticalMenu
    })
  }
});

export default connect(mapStateToProps, mapDispatchToTops)(withRouter(VerticalMenu));