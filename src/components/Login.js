import React, { useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Error from './Error';

const Login = (props) => {
  const [data, setData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const { email, password, remember } = data;

  const [error, setError] = useState({
    state: false,
    message: ''
  });

  const inputChange = e => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    setData({
      ...data,
      [e.target.name]: value
    });
  }

  const submitLogin = e => {
    e.preventDefault();

    if (email.trim() === '' || password.trim() === '') {
      return;
    }

    axios.post(`https://api.geekshubsacademy.com/api/ams/v1_5/public/login/`,
      {
        'nickname': email,
        'password': password
      })
      .then(res => {
        if (res.status === 204) {
          setError({
            state: true,
            message: 'Incorrect <strong>Email</strong> or <strong>Password</strong>'
          });
          return;
        }
        localStorage.setItem('jwt', res.data.jwt);
        localStorage.setItem('nickname', res.data.user.nickname);
        localStorage.setItem('rol', res.data.user.rol);
        if (res.data.user.rol > 60) {
          props.history.push("/inside");
        }
      })
      .catch(err => {
        if (err.response.data.res === "2") {
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
    <div className="content">
      <form
        onSubmit={submitLogin}
      >
        <p>Login</p>
        {error.state ? <Error message={error.message} /> : null}
        <div className="form-group">
          <span>@</span>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={inputChange}
            required
          />
        </div>

        <div className="form-group">
          <span>*</span>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={inputChange}
            required
          />
        </div>

        <div className="form-checkbox">
          <input
            type="checkbox"
            name="remember"
            value={remember}
            onChange={inputChange}
          />
          <label>Remember me</label>
        </div>

        <button
          type="submit"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;