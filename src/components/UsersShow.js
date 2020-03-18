import React, { Fragment, useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { CSVLink } from "react-csv";
import Header from './Header';
import { localGetItem } from '../services/localstorage.service';
import UsersService from '../services/apis/users.service';
import toPDF from '../services/toPDF.service';
import getColumnSearchProps from '../services/tableColumnSearch.service';
import { parseDate } from '../services/helpers.service';

const UserShow = () => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const [exportData, setExportData] = useState({
    title: '',
    headers: [],
    data: []
  })

  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
    },
    {
      title: '',
      dataIndex: 'img_profile',
      render: (img_profile) => <img src={img_profile} />
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: {
        compare: (a, b) => {
          try {
            return a.fullName.localeCompare(b.fullName)
          } catch (error) { }
        },
        multiple: 4,
      },
      ...getColumnSearchProps('fullName'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: {
        compare: (a, b) => {
          try {
            return a.email.localeCompare(b.email)
          } catch (error) { }
        },
        multiple: 3,
      },
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      sorter: {
        compare: (a, b) => {
          try {
            return a.active.localeCompare(b.active)
          } catch (error) { }
        },
        multiple: 2,
      },
      ...getColumnSearchProps('active'),
    },
    {
      title: 'Register Date',
      dataIndex: 'date',
      key: 'date',
      sorter: {
        compare: (a, b) => {
          try {
            return a.date.localeCompare(b.date)
          } catch (error) { }
        },
        multiple: 1,
      },
      ...getColumnSearchProps('date'),
    },
  ];

  useEffect(() => {
    const token = localGetItem('jwt');
    setLoading(true);

    UsersService.getUsers(token)
      .then(res => {
        setData(res.data.user.map(user => (
          {
            key: user.id,
            img_profile: user.img_profile !== null ? user.img_profile : '/img/logo-no-image.png',
            fullName: `${user.name} ${user.surname}`,
            email: user.email,
            active: user.active ? 'Active' : 'Inactive',
            date: parseDate(user.createdAt)
          }
        ))
        );

        setExportData(
          {
            title: 'Users',
            headers: [columns.filter(column => column.title !== '').map(column => column.title)],
            data: res.data.user.map(user => (
              [
                user.id,
                `${user.name} ${user.surname}`,
                user.email,
                user.active ? 'Active' : 'Inactive',
                parseDate(user.createdAt)
              ]
            ))
          }
        );

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  return (
    <Fragment>
      <Header />
      <div id="show">
        <div id="content">
          <h1>Users</h1>
          <div id="btn">
            <Button onClick={() => toPDF(
              exportData.title,
              exportData.headers,
              exportData.data,
              'users.pdf',
              'landscape'
            )}>PDF</Button>
            <CSVLink
              className="ant-btn"
              filename={"users.csv"}
              data={exportData.headers.concat(exportData.data)}>
              CSV
            </CSVLink>
          </div>
          <div id="table">
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 5 }}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default UserShow;