import React, { Fragment, useState, useEffect } from 'react';
import { Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getLocalJwt } from '../services/localStorage.service';
import UsersService from '../services/apis/users.service';
import Header from './Header';
import Tile from './Tile';

const Dashboard = ({ ...props }) => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({});

  useEffect(() => {
    const token = getLocalJwt();
    if (token === null) props.history.push("/");

    setLoading(true);

    UsersService.getUsers(token)
      .then(res => {
        setData(
          {
            registers: res.data.user.length,
            active: res.data.user.filter(user => user.active).length,
            inactive: res.data.user.filter(user => !user.active).length,
          }
        );

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  return (
    <Fragment>
      <Header />
      {loading ?
        <div className="spinner">
          <Spin />
        </div> :
        null
      }
      <div id="dashboard">
        <div id="content">
          <h1>Dashboard</h1>
          <div id="tiles">
            <div id="users-registered">
              <Tile
                image={<  UserOutlined />}
                statics={data.registers}
                title={'registered user'}
              />
            </div>
            <div id="users-active">
              <Tile
                image={<  UserOutlined />}
                statics={data.active}
                title={'active user'}
              />
            </div>
            <div id="users-inactive">
              <Tile
                image={<  UserOutlined />}
                statics={data.inactive}
                title={'inactive user'}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
};

export default Dashboard;