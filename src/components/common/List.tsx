import React, { useState } from "react";
import { Button, message, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

interface IListItemProps {
  title: string;
  subtitle: string;
  modalChildren: React.ReactNode;
  onDeleteClick: () => Promise<boolean>;
  onSaveClick: () => Promise<boolean>;
}
export const ListItem: React.FC<IListItemProps> = ({
  title,
  subtitle,
  modalChildren,
  onDeleteClick,
  onSaveClick,
}) => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const [loading, setLoading] = useState<Record<"save" | "delete", boolean>>({
    save: false,
    delete: false,
  });
  const modalOk = async () => {
    setLoading((state) => ({ ...state, save: true }));
    try {
      await onSaveClick();
    } catch (err) {
      message.error(err?.toString());
    }
    setLoading((state) => ({ ...state, save: false }));
    closeModal();
  };

  const modalDelete = async () => {
    setLoading((state) => ({ ...state, delete: true }));
    try {
      await onDeleteClick();
    } catch (err) {
      message.error(err?.toString());
    }
    setLoading((state) => ({ ...state, delete: false }));
    closeModal();
  };

  return (
    <>
      <div className="border border-gray-300 p-2 rounded flex flex-row justify-between items-center">
        <div>
          <div className="font-medium text-lg">{title}</div>
          <div className="font-light font-sm">{subtitle}</div>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <Button
            type="primary"
            icon={<InfoCircleOutlined />}
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>
      <Modal
        title="Edit list"
        visible={showModal}
        onOk={onSaveClick}
        onCancel={closeModal}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={modalOk}
            loading={loading.save ?? false}
          >
            Submit
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={modalDelete}
            loading={loading.delete ?? false}
          >
            Delete
          </Button>,
        ]}
      >
        {modalChildren}
      </Modal>
    </>
  );
};

export const ListContainer: React.FC = ({ children }) => (
  <>
    <div className="space-y-2">{children}</div>
  </>
);
