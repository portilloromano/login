import React, { useState, Fragment, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import Header from './Header';
import { localGetItem } from '../services/localstorage.service';
import InvitationsService from '../services/apis/invitations.service';
import ModalMessage from './ModalMessage';

const token = localGetItem('jwt');

const Invitation = () => {
  const { Option } = Select;

  const [modalShow, setModalShow] = useState({
    type: '',
    title: '',
    body: '',
    visible: false
  });

  const { type, title, body, visible } = modalShow;

  const [business, setBusiness] = useState([]);

  useEffect(() => {
    InvitationsService.getBusiness(token)
      .then(res => {
        setBusiness(res.data.business);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  const onFinish = values => {
    const data = {
      data: values
    }

    InvitationsService.postInvitation(data, token)
      .then(res => {
        setModalShow({
          type: 'success',
          title: 'Invitation',
          body: 'The invitation was sent',
          visible: true
        });
      })
      .catch(err => {
        setModalShow({
          type: 'error',
          title: 'Invitation',
          body: 'The invitation was not sent',
          visible: true
        });
        console.log(err);
      })
  };

  return (
    <Fragment>
      <Header />
      <div id="invitation">
        <Form
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <div id="form">
            <h1>Send Invitation</h1>

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="surname"
              rules={[{ required: true, message: 'Please input your last name!' }]}

            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid Email!',
                },
                {
                  required: true,
                  message: 'Please input your Email!',
                },
              ]}

            >
              <Input />
            </Form.Item>

            <div id="select">
              <Form.Item
                name="empresaId"
                label="Business"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  placeholder="Select a option"

                  allowClear
                >
                  {business.sort((a, b) => {
                    const businessNameA = a.businessName.toUpperCase();
                    const businessNameB = b.businessName.toUpperCase();

                    let compare = 0;
                    businessNameA > businessNameB ? compare = 1 : compare = -1;

                    return compare;
                  }).map(item => <Option key={item.id} value={item.id}>{item.businessName}</Option>)}
                </Select>
              </Form.Item>

              <Form.Item
                name="rol"
                label="Role"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  placeholder="Select a option"

                  allowClear
                >
                  <Option value={0}>User</Option>
                  <Option value={15}>Teacher</Option>
                  <Option value={30}>It-Director</Option>
                  <Option value={50}>Manager</Option>
                  <Option value={99}>Admin</Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Send Invitation
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      {visible ? <ModalMessage type={type} title={title} body={body} /> : null}
    </Fragment>
  );
}

export default Invitation;