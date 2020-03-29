import React, { useState, Fragment, useEffect } from 'react';
import { Form, Input, Button, Select, Modal } from 'antd';
import Header from './Header';
import { getLocalJwt } from '../services/localStorage.service';
import InvitationsService from '../services/apis/invitations.service';
import Footer from './Footer';

const Invitation = ({ ...props }) => {
  const token = getLocalJwt();
  if (token === null) props.history.push("/");

  const { Option } = Select;

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

  const modalError = (title, body) => {
    Modal.error({
      title: title,
      content: (
        <div>
          <p>{body}</p>
        </div>
      ),
    });
  }

  const onFinish = values => {
    const data = {
      data: values
    }

    InvitationsService.postInvitation(data, token)
      .then(res => {
        modalSuccess('Invitation', 'The invitation was sent');
      })
      .catch(err => {
        modalError('Invitation', 'The invitation was not sent');
        console.log(err);
      })
  };

  return (
    <Fragment>
      <Header />
      <div id="invitation">
        <div id="content">
          <Form
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
                      message: 'Please select a business!',
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
                      message: 'Please select a role!',
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
      </div>
      <Footer />
    </Fragment>
  );
}

export default Invitation;