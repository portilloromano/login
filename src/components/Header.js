import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Button, Avatar } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  localRemoveItem,
  sessionRemoveItem,
  getLocalUser
} from '../services/localStorage.service';
import VerticalMenu from './VerticalMenu';

const Header = ({ setVerticalMenu, verticalMenu, ...props }) => {
  const { inlineCollapsed } = verticalMenu;

  const { SubMenu } = Menu;
  const user = getLocalUser();
  if (user.exist === false) props.history.push("/");

  const { nickname, img_profile, rol } = user;

  // const img_profile = 'https://4.bp.blogspot.com/-n32HFYm_M1s/W-NQgb9lEgI/AAAAAAAAC_Y/B1jbOYulJVwC3OsETCYXy_42jKLfJNnPwCLcBGAs/s1600/fe59b1037afbdf220b1ed0e301fa8984.jpg';

  const toggleCollapsed = () => {
    setVerticalMenu(
      {
        ...verticalMenu,
        inlineCollapsed: !inlineCollapsed
      });
  };

  const sesionClose = () => {
    localRemoveItem('user');
    sessionRemoveItem('user');
  }

  return (
    <Fragment>
      <header>
        <div id="logo-button">
          <img src="/img/logo.svg" alt="GeeksHubs Academy" id="logo" />

          <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
            {React.createElement(inlineCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
          </Button>
        </div>

        <Menu
          id="user"
          mode="horizontal"
        >
          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                <span>{`${nickname} (${rol})`}</span>
                <div>
                  {
                    img_profile !== null ? <Avatar src={img_profile} /> : <Avatar icon={<UserOutlined />} />
                  }

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
      <VerticalMenu />
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

export default connect(mapStateToProps, mapDispatchToTops)(withRouter(Header));