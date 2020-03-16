import React, { useState } from 'react';
import { connect } from 'react-redux';
import Error from './Error';
import { localSetItem } from '../services/localstorage.service';
import LoginService from '../services/apis/login.service';

const Login = ({ addUser, ...props }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const { email, password, remember } = formData;

  const [error, setError] = useState({
    state: false,
    message: ''
  });

  const inputChange = e => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  }

  const submitLogin = e => {
    e.preventDefault();

    if (email.trim() === '' || password.trim() === '') {
      return;
    }

    LoginService.postLogin(email, password)
      .then(res => {
        if (res.status === 204) {
          setError({
            state: true,
            message: 'Incorrect <strong>Email</strong> or <strong>Password</strong>'
          });
          return;
        }
        localSetItem('jwt', res.data.jwt);

        addUser({
          nickname: res.data.user.nickname,
          rol: res.data.user.rol
        });

        if (res.data.user.rol > 60) {
          props.history.push("/inside");
        }
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
    <div className="content">
      <div id="content-form" >
        <img src="./logo.svg" alt="GeeksHubs Academy" id="logo" />
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
    </div>
  );
}

const mapDispatchToTops = dispatch => ({
  addUser(user) {
    dispatch({
      type: 'ADD_USER',
      user
    })
  }
});

export default connect(null, mapDispatchToTops)(Login);