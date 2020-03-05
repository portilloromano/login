import React from 'react';

const Inside = ({user}) => {
  let nickname = localStorage.getItem('nickname');
  let rol = localStorage.getItem('rol');
  let userRol = "user";
  if (rol === '99') {
    userRol = "admin"
  }
  return (
    <header>
      {nickname} ({userRol})
    </header>
  );
}

export default Inside;