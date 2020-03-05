import React from 'react';

const Error = ({message}) => (
  <p className="error" dangerouslySetInnerHTML={{__html:message}} ></p>
);

export default Error;