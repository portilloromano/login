import React, { Fragment, useEffect } from 'react';
import { Modal } from 'antd';

const ModalMessage = ({ type, title, body }) => {
  const [modal, contextHolder] = Modal.useModal();;

  useEffect(() => {
    const config = {
      title: title,
      content: (
        <div>
          <p>{body}</p>
        </div>
      )
    };

    switch (type) {
      case 'info':
        modal.info(config);
        break;
      case 'success':
        modal.success(config);
        break;
      case 'error':
        modal.error(config);
        break;
      case 'warning':
        modal.warning(config);
        break;
      default:
        break;
    }
  }, [])

  return (
    <Fragment>
      {/* `contextHolder` should always under the context you want to access */}
      {contextHolder}
    </Fragment>
  );
};

export default ModalMessage;