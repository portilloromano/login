import React from 'react';

const Tile = ({ image, statics, title }) => {
  return (
    <div className="tile">
      <div className="left">
        {image}
      </div>
      <div className="right">
        <span className="statics">{statics}</span>
        <span className="title">{title}</span>
      </div>
    </div>
  );
}

export default Tile;