import React, { useEffect, useState } from 'react';

const Time = () => {
  const [time, setTime] = useState('');

  const checkTime = (i) => {
    if (i < 10) { i = '0' + i };
    return i;
  }

  const updateTime = () => {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    // let s = today.getSeconds();
    m = checkTime(m);
    // s = checkTime(s);
    setTime(h + ':' + m);
  }

  useEffect(() => {
    setTimeout(updateTime, 1000);
  }, []);

  return (
    <div id="time">
      {time}
    </div>
  );
}

export default Time;