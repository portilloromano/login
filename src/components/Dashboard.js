import React, { Fragment, useState, useEffect } from 'react';
import { Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { LineChart, Line, Label, Tooltip, ResponsiveContainer, XAxis } from 'recharts';
import { getLocalJwt } from '../services/localStorage.service';
import UsersService from '../services/apis/users.service';
import Header from './Header';
import Tile from './Tile';
import Footer from './Footer';

const Dashboard = ({ ...props }) => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({});

  const [dataChart, setDataChart] = useState([]);

  const countByMonth = (users) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const year_current = new Date().getFullYear();
    for (let i = 1; i <= 12; i++) {
      setDataChart(dataChart =>
        [
          ...dataChart,
          {
            month: monthNames[i - 1],
            users: users.filter(user => {
              let date = new Date(user.createdAt);
              if (date.getFullYear() === year_current && date.getMonth() === i) {
                return user;
              }
              return null;
            }).length
          }
        ]
      )
    }
  }

  useEffect(() => {
    const token = getLocalJwt();
    if (token === null) props.history.push("/");

    setLoading(true);

    UsersService.getUsers(token)
      .then(res => {
        countByMonth(res.data.user);
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div id="tooltips">
          <span className="month">{label}</span>
          <span className="value">{`Users: ${payload ? payload[0].value : null}`}</span>
        </div>
      );
    }

    return null;
  };

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
            <div id="news-users-chart">
              <span id="title-chart">New Users:</span>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={dataChart}>
                  <XAxis
                    dataKey="month"
                    hide={true}
                  />

                  <Label value="New users:" position="insideTop" />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={false}
                  />

                  <Line
                    type='monotone'
                    dataKey='users'
                    stroke='#ffffff'
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  )
};

export default Dashboard;