import React, { Fragment, useState, useEffect } from 'react';
import { Table, Button, Modal, Card, Pagination, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { CSVLink } from "react-csv";
import Header from './Header';
import { getLocalJwt } from '../services/localStorage.service';
import UsersService from '../services/apis/users.service';
import toPDF from '../services/toPDF.service';
import getColumnSearchProps from '../services/tableColumnSearch.service';
import { parseDate } from '../services/helpers.service';
import Footer from './Footer';

const UserShow = ({ ...props }) => {
  const token = getLocalJwt();
  if (token === null) props.history.push("/");

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const [dataExport, setDataExport] = useState({
    title: '',
    headers: [],
    data: []
  });

  const [page, setPage] = useState({
    current: 1,
    total: 0
  });

  const { confirm } = Modal;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
    },
    {
      title: '',
      dataIndex: 'img_profile',
      render: (img_profile) => <img src={img_profile} alt="" />
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
        multiple: 6,
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
        multiple: 5,
      },
      ...getColumnSearchProps('email'),
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      sorter: {
        compare: (a, b) => {
          try {
            return a.state.localeCompare(b.state)
          } catch (error) { }
        },
        multiple: 4,
      },
      ...getColumnSearchProps('state'),
    },
    {
      title: 'RGPD',
      dataIndex: 'rgpd',
      key: 'rgpd',
      sorter: {
        compare: (a, b) => {
          try {
            return a.rgpd.localeCompare(b.rgpd)
          } catch (error) { }
        },
        multiple: 3,
      },
      ...getColumnSearchProps('rgpd'),
    },
    {
      title: 'Notifications',
      dataIndex: 'notifications',
      key: 'notifications',
      sorter: {
        compare: (a, b) => {
          try {
            return a.notifications.localeCompare(b.notifications)
          } catch (error) { }
        },
        multiple: 2,
      },
      ...getColumnSearchProps('notifications'),
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
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          onClick={() => modalConfirm(record)}
        >
          Activate
        </Button>
      ),
    },
  ];

  const loadData = () => {
    setLoading(true);

    UsersService.getUsers(token)
      .then(res => {
        let sortedByIdDes = res.data.user.sort((a, b) => (b.id - a.id));
        setData(sortedByIdDes.map(user => (
          {
            key: user.id,
            img_profile: user.img_profile !== null ? user.img_profile : '/img/logo-no-image.png',
            fullName: `${user.name} ${user.surname}`,
            email: user.email,
            state: user.active ? 'Active' : 'Inactive',
            rgpd: user.rgpd ? 'Yes' : 'No',
            notifications: user.notifications ? 'Yes' : 'No',
            date: parseDate(user.createdAt)
          }
        ))
        );

        setPage({
          ...page,
          total: res.data.user.length
        });

        setDataExport(
          {
            title: 'Users',
            headers: [columns.filter(column =>
              column.title !== '' && column.title !== 'Action').map(column => column.title)],
            data: sortedByIdDes.map(user => (
              [
                user.id,
                `${user.name} ${user.surname}`,
                user.email,
                user.active ? 'Active' : 'Inactive',
                user.rgpd ? 'Yes' : 'No',
                user.notifications ? 'Yes' : 'No',
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
  }

  useEffect(() => {
    loadData();
  }, []);

  const modalConfirm = record => {
    confirm({
      title: 'Do you Want to activated these user?',
      icon: <ExclamationCircleOutlined />,
      content: record.fullName,
      onOk() {
        activate(record);
      },
    });
  }

  const activate = (record) => {
    UsersService.activateUser(record.key, token)
      .then(res => {
        loadData();
      })
      .catch(err => {
        console.log(err);
      })
  }

  const changePage = currentPage => {
    setPage({
      ...page,
      current: currentPage,
    });
  }

  const changeRowColor = (record) => {
    if (record.rgpd === 'No' && record.notifications === 'No') {
      return 'row-color-alert';
    } else if (record.rgpd === 'No') {
      return 'row-color-warning';
    }
    else {
      return null;
    }
  }

  return (
    <Fragment>
      <Header />
      <div id="show">
        <div id="content">
          <h1>Users</h1>
          <div id="btn">
            <Button onClick={() => toPDF(
              dataExport.title,
              dataExport.headers,
              dataExport.data,
              'users.pdf',
              'landscape'
            )}>PDF</Button>
            <CSVLink
              className="ant-btn"
              filename={"users.csv"}
              data={dataExport.headers.concat(dataExport.data)}>
              CSV
            </CSVLink>
          </div>
          <div id="table">
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 5 }}
              loading={loading}
              rowClassName={(record, index) => changeRowColor(record)}
            />
          </div>
          <div id="mobile">
            {loading ?
              <div className="spinner">
                <Spin />
              </div> :
              null
            }
            <div id="cards">
              {data.slice((page.current - 1) * 5, page.current * 5).map(user => {
                return (
                  < Card
                    title={`Id. ${user.key}`}
                    key={user.key}
                    className="card"
                    headStyle={user.rgpd === 'No' && user.notifications === 'No' ?
                      { backgroundColor: 'lightcoral' } :
                      user.rgpd === 'No' ?
                        { backgroundColor: 'lightgoldenrodyellow' } :
                        null
                    }
                  >
                    <div id="image">
                      <img src={user.img_profile} alt={user.fullName} />
                    </div>
                    <p><strong>Name:</strong> {user.fullName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>State:</strong> {user.state}</p>
                    <p><strong>RGPD:</strong> {user.rgpd}</p>
                    <p><strong>Notifications:</strong> {user.notifications}</p>
                    <p><strong>Date:</strong> {user.date}</p>
                    <Button onClick={() => modalConfirm(user.key)}>
                      Activate
                    </Button>
                  </Card>
                );
              })
              }
            </div>
            <div id="pagination">
              <Pagination
                current={page.current}
                onChange={changePage}
                pageSize="5"
                total={page.total}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment >
  );
}

export default UserShow;