import React, { useState } from "react";
import Button from "./Button";
import { InformationCircleIcon } from "./Icons";
import Modal from "./Modal";

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

  return (
    <>
      <div className="border border-gray-300 p-2 rounded flex flex-row justify-between items-center">
        <div>
          <div className="font-medium text-lg">{title}</div>
          <div className="font-light font-sm">{subtitle}</div>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <Button
            outline
            icon={InformationCircleIcon}
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>
      {showModal && (
        <Modal
          isOpen={showModal}
          close={() => setShowModal(false)}
          save={onSaveClick}
          delete={onDeleteClick}
        >
          {modalChildren}
        </Modal>
      )}
    </>
  );
};

export const ListContainer: React.FC = ({ children }) => (
  <>
    <div className="space-y-2">{children}</div>
  </>
);
