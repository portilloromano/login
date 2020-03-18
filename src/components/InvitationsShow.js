import React, { Fragment, useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { CSVLink } from "react-csv";
import Header from './Header';
import { localGetItem } from '../services/localstorage.service';
import InvitationsService from '../services/apis/invitations.service';
import toPDF from '../services/toPDF.service';
import getColumnSearchProps from '../services/tableColumnSearch.service';
import { parseDate } from '../services/helpers.service';

const InvitationsShow = () => {
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
      title: 'Company',
      dataIndex: 'empresa',
      key: 'empresa',
      sorter: {
        compare: (a, b) => {
          try {
            return a.empresa.localeCompare(b.empresa)
          } catch (error) { }
        },
        multiple: 2,
      },
      ...getColumnSearchProps('empresa'),
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

    InvitationsService.getInvitations(token)
      .then(res => {
        setData(res.data.user.map(invitation => (
          {
            key: invitation.id,
            fullName: `${invitation.name} ${invitation.surname}`,
            email: invitation.email,
            empresa: invitation.empresa,
            date: parseDate(invitation.createdAt)
          }
        ))
        );

        setExportData(
          {
            title: 'Invitations',
            headers: [columns.map(column => column.title)],
            data: res.data.user.map(invitation => (
              [
                invitation.id,
                `${invitation.name} ${invitation.surname}`,
                invitation.email,
                invitation.empresa,
                parseDate(invitation.createdAt)
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
          <h1>Invitations</h1>
          <div id="btn">
            <Button onClick={() => toPDF(
              exportData.title,
              exportData.headers,
              exportData.data, 'invitations.pdf',
              'landscape'
            )}>PDF</Button>
            <CSVLink
              className="ant-btn"
              filename={"invitations.csv"}
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

export default InvitationsShow;