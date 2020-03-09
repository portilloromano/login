import React from 'react';
import { connect } from 'react-redux';

const Inside = ({ user }) => {
  const { nickname, rol } = user;

  let userRol = "user";
  if (rol === 99) {
    userRol = "admin"
  }
  return (
    <header>
      <img src="./logo.svg" alt="GeeksHubs Academy" id="logo" />
      <div id="user">
        <p>{nickname}</p>
        <p>({userRol})</p>
      </div>
    </header>
  );
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Inside);