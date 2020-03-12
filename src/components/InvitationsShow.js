import React, { Fragment, useState, useEffect } from 'react';
import { Table } from 'antd';
import Header from './Header';
import { localGet } from '../services/localstorage.service';
import InvitationService from '../services/apis/invitation.service';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Full Name',
    dataIndex: 'fullName',
    sorter: {
      compare: (a, b) => a.fullName - b.fullName,
      multiple: 4,
    },
  },
  {
    title: 'Email',
    dataIndex: 'email',
    sorter: {
      compare: (a, b) => a.email - b.email,
      multiple: 3,
    },
  },
  {
    title: 'Company',
    dataIndex: 'company',
    sorter: {
      compare: (a, b) => a.company - b.company,
      multiple: 2,
    },
  },
  {
    title: 'Register Date',
    dataIndex: 'registerDate',
    sorter: {
      compare: (a, b) => a.registerDate - b.registerDate,
      multiple: 1,
    },
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
}

const InvitationsShow = () => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const token = localGet('jwt');

    InvitationService.getInvitations(token)
      .then(res => {
        setInvitations(res.data.user);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  return (
    <Fragment>
      <Header />
      <h1>See Invitations</h1>
      <Table columns={columns} pagination={10} dataSource={invitations} onChange={onChange} />
    </Fragment>
  );
}

export default InvitationsShow;