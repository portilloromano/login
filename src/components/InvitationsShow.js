import React, { Fragment, useState, useEffect } from 'react';
import { Table, Button, Modal, Card, Pagination, Spin } from 'antd';
import { CSVLink } from "react-csv";
import Header from './Header';
import { getLocalJwt } from '../services/localStorage.service';
import InvitationsService from '../services/apis/invitations.service';
import toPDF from '../services/toPDF.service';
import getColumnSearchProps from '../services/tableColumnSearch.service';
import { parseDate } from '../services/helpers.service';
import Footer from './Footer';

const InvitationsShow = ({ ...props }) => {
  const token = getLocalJwt();
  if (token === null) props.history.push("/");

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const [dataExport, setDataExport] = useState({
    title: '',
    headers: [],
    data: []
  })

  const [page, setPage] = useState({
    current: 1,
    total: 0
  });

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
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button onClick={() => resend(record)}>
          Resend
        </Button>
      ),
    },
  ];

  const loadData = () => {
    setLoading(true);

    InvitationsService.getInvitations(token)
      .then(res => {
        setData(res.data.user.map(invitation => (
          {
            ...invitation,
            key: invitation.id,
            fullName: `${invitation.name} ${invitation.surname}`,
            date: parseDate(invitation.createdAt)
          }
        ))
        );

        setPage({
          ...page,
          total: res.data.user.length
        });

        setDataExport(
          {
            title: 'Invitations',
            headers: [columns.filter(column =>
              column.title !== 'Action').map(column => column.title)],
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
  }

  useEffect(() => {
    loadData();
  }, [])

  const modalSuccess = (title, body) => {
    Modal.success({
      title: title,
      content: (
        <div>
          <p>{body}</p>
        </div>
      ),
    });
  }

  const resend = (record) => {
    InvitationsService.deleteInvitation(record.key, token)
      .then(res => {
        InvitationsService.postInvitation({ data: record }, token)
          .then(res => {
            modalSuccess('Invitation', 'The invitation was forwarded');

            loadData();
          })

          .catch(err => {
            console.log(err);
          })
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
    let dateCreate = new Date(record.date);
    let dateNow = new Date();

    let daysDifference = Math.round((dateNow.getTime() - dateCreate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDifference > 5) {
      return 'row-color-alert';
    } else {
      return null;
    }
  }

  return (
    <Fragment>
      <Header />
      <div id="show">
        <div id="content">
          <h1>Invitations</h1>
          <div id="btn">
            <Button onClick={() => toPDF(
              dataExport.title,
              dataExport.headers,
              dataExport.data, 'invitations.pdf',
              'landscape'
            )}>PDF</Button>
            <CSVLink
              className="ant-btn"
              filename={"invitations.csv"}
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
              {data.slice((page.current - 1) * 5, page.current * 5).map(invitation => {
                let dateCreate = new Date(invitation.date);
                let dateNow = new Date();
                let daysDifference = Math.round((dateNow.getTime() - dateCreate.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  < Card
                    title={`Id. ${invitation.key}`}
                    key={invitation.key}
                    className="card"
                    headStyle={daysDifference > 5 ? { backgroundColor: 'lightcoral' } : null}
                  >
                    <p><strong>Name:</strong> {invitation.fullName}</p>
                    <p><strong>Email:</strong> {invitation.email}</p>
                    <p><strong>Company:</strong> {invitation.empresa}</p>
                    <p><strong>Date:</strong> {invitation.date}</p>
                    <Button onClick={() => resend(invitation)}>
                      Resend
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
    </Fragment>
  );
}

export default InvitationsShow;