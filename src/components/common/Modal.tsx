import React, { useEffect, useState } from "react";
import { useToCaptureClickOutside } from "../../hooks/hooks";
import Button from "./Button";
import { DeleteIcon, SaveIcon } from "./Icons";

interface IModalProps {
  isOpen: boolean;
  close: () => void;
  save?: () => Promise<boolean>;
  delete?: () => Promise<boolean>;
}

const Modal: React.FC<IModalProps> = (props) => {
  let savePromise: Promise<any> | null = null;
  const [saveLoading, setSaveLoading] = useState(false);
  const saveWrapper = async () => {
    if (props.save) {
      setSaveLoading(true);
      savePromise = props.save();
      const canClose = await savePromise;
      setSaveLoading(false);
      if (canClose) {
        props.close();
      }
    }
  };

  let deletePromise: Promise<any> | null = null;
  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteWrapper = async () => {
    if (props.delete) {
      setDeleteLoading(true);
      deletePromise = props.delete();
      const canClose = await deletePromise;
      setDeleteLoading(false);
      if (canClose) {
        props.close();
      }
    }
  };

  useEffect(
    () =>
      function cleanup() {
        setSaveLoading(false);
        setDeleteLoading(false);
        props.close();
      },
    [props]
  );

  const closeOutsideNodeRef: any = useToCaptureClickOutside(
    props.isOpen,
    props.close
  );

  return (
    <>
      <div
        className="fixed z-10 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    --> */}
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          />

          {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          {/* <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    --> */}
          <div
            ref={closeOutsideNodeRef}
            className="inline-block w-full align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-4 sm:pb-4">
              {/* <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Deactivate account
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to deactivate your account? All of
                      your data will be permanently removed. This action cannot
                      be undone.
                    </p>
                  </div>
                </div>
  </div> */}
              {props.children}
            </div>
            <div className="bg-gray-50 space-y-2 px-2 py-4 sm:space-y-0 sm:px-4 sm:flex sm:flex-row">
              {props.delete && (
                <Button
                  label="Delete"
                  onClick={deleteWrapper}
                  icon={DeleteIcon}
                  loading={deleteLoading}
                  danger
                  className={props.save && "sm:mr-1"}
                />
              )}
              {props.save && (
                <Button
                  label="Save"
                  onClick={saveWrapper}
                  icon={SaveIcon}
                  loading={saveLoading}
                  className={props.delete && "sm:ml-1"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
