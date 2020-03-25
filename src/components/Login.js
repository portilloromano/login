import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import Error from './Error';
import { localSetItem, sessionSetItem } from '../services/localStorage.service';
import LoginService from '../services/apis/login.service';
import UserService from '../services/apis/users.service';

const Login = ({ ...props }) => {
  const [error, setError] = useState({
    state: false,
    message: ''
  });

  const onFinish = values => {
    const data = {
      data: values
    }

    LoginService.postLogin(data)
      .then(res => {
        if (res.status === 204) {
          setError({
            state: true,
            message: 'Incorrect <strong>Email</strong> or <strong>Password</strong>'
          });
          return;
        }

        UserService.getUsers(res.data.jwt)
          .then(resUser => {
            const userFilterById = resUser.data.user.filter(user =>
              user.id === res.data.user.id
            );

            const { img_profile, rol } = userFilterById[0];

            const user = {
              nickname: res.data.user.nickname,
              img_profile: img_profile,
              rol: rol === 99 ? 'admin' : 'user',
              jwt: res.data.jwt
            }

            if (data.data.remember === true) {
              localSetItem('user', user);
            }
            else {
              sessionSetItem('user', user);
            }

            if (res.data.user.rol < 60) {
              setError({
                state: true,
                message: 'You do not have sufficient privileges'
              });
              return;
            }
            props.history.push("/dashboard");
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        if (err.response?.data?.res === "2") {
          setError({
            state: true,
            message: 'Incorrect <strong>Email</strong> or <strong>Password</strong>'
          });
        } else {
          console.log(err);
        }
      })
  }

  return (
    <div id="content-login">
      <div id="content-form" >
        <img src="/img/logo.svg" alt="GeeksHubs Academy" id="logo" />
        <Form
          onFinish={onFinish}
        >
          <p>Login</p>
          {error.state ? <Error message={error.message} /> : null}

          <Form.Item
            name="nickname"
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
            <Input addonBefore="@" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password addonBefore="*" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            className="form-checkbox"
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item >
            <Button type="primary" htmlType="submit">
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;