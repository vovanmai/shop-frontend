import React, { useState } from 'react';
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons'
import { MouseEvent } from 'react';

type PropsType = {
  visible: boolean,
  title?: string,
  content?: any,
  confirmLoading: boolean,
  onOk: () => void,
  onCancel: () => void,
}

const ConfirmModal = (props: PropsType) => {
  const {
    visible,
    title,
    content,
    confirmLoading,
    onOk,
    onCancel,
  } = props

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };

  return (
    <>
      <Modal
        open={visible}
        width={416}
        onOk={onOk}
        confirmLoading={confirmLoading}
        onCancel={onCancel}
      >
        <div style={{ display: "flex"}}>
          <div style={{ marginRight: 10 }}><ExclamationCircleFilled style={{ color: '#faad14', fontSize: 25}} /></div>
          <div>
            <span
              style={{
                color: 'rgb(0 0 0 / 88%)',
                fontWeight: 600,
                fontSize: 16,
                lineHeight: 1.5
              }}
            >{title ? title : 'Bạn có chắc chắn không ?'}</span>
            <div style={{ marginTop: 10 }}>
              { content ? content : 'Dữ liệu bị xoá sẽ không thể khôi phục lại.'}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmModal