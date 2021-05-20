import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, message, Modal } from "antd";
import React, { useState } from "react";
import PageContainer from "../components/common/PageContainer";
import EmojiHeader from "../components/common/EmojiHeader";
import { useStoreDispatch, useStoreState } from "../store/hooks";
import { List } from "../types/lists";

interface ListProps {
  list: List;
}
interface ListEditForm {
  name: string;
  isDefault: boolean;
}
const ListWrapper: React.FC<ListProps> = ({ list }) => {
  const dispatch = useStoreDispatch();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm<ListEditForm>();

  const deleteList = async () => {
    setDeleteLoading(true);
    const error = await dispatch.lists.removeList(list);
    if (error) {
      message.error(error.error);
    }
    setDeleteLoading(false);
  };

  const editList = () => {
    setModalVisible(true);
    form.setFieldsValue({
      name: list.name,
      isDefault: list.isDefault,
    });
  };

  const saveList = async (values: ListEditForm) => {
    if (values.name) {
      setSaveLoading(true);
      const error = await dispatch.lists.updateList({
        ...values,
        id: list.id,
        items: list.items,
      });
      if (error) {
        message.error(error.error);
      }
    }
    setSaveLoading(false);
    setModalVisible(false);
  };

  return (
    <Card
      size="small"
      actions={[
        <Button
          key="edit"
          type="text"
          block
          icon={<EditOutlined />}
          onClick={editList}
        />,
        <Button
          key="delete"
          type="text"
          danger
          block
          icon={<DeleteOutlined />}
          loading={deleteLoading}
          onClick={deleteList}
        />,
      ]}
    >
      {list.name}

      <Modal
        title="Edit list"
        visible={modalVisible}
        onOk={() => saveList(form.getFieldsValue())}
        onCancel={() => setModalVisible(false)}
        confirmLoading={saveLoading}
      >
        <Form form={form} onFinish={saveList}>
          <Form.Item name="name" rules={[{ required: true }]}>
            <Input placeholder="List name" />
          </Form.Item>
          <Form.Item name="isDefault" valuePropName="checked">
            <Checkbox>Default</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

const Lists: React.FC = () => {
  const lists = useStoreState((state) => state.lists.lists);
  const dispatch = useStoreDispatch();
  const [addLoading, setAddLoading] = useState(false);

  const [form] = Form.useForm();

  const onAddFinish = async (values: { name: string }) => {
    if (values.name) {
      setAddLoading(true);
      const error = await dispatch.lists.addList(values);
      if (error) {
        message.error(error.error);
      } else {
        form.setFieldsValue({ name: "" });
      }
      setAddLoading(false);
    }
  };

  return (
    <>
      <PageContainer className="mx-auto max-w-3xl">
        <EmojiHeader src="/img/emoji/spiral-notepad.svg" title="Your lists" />

        <div className="space-y-2">
          <Form
            layout="inline"
            form={form}
            onFinish={onAddFinish}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {/* 16px = margin-right, 32px = button width */}
            <Form.Item
              name="name"
              style={{ width: "calc(100% - 16px - 32px)" }}
            >
              <Input placeholder="List name" />
            </Form.Item>
            <Form.Item style={{ marginRight: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={addLoading}
              />
            </Form.Item>
          </Form>

          <div className="space-y-2">
            {lists.map((list) => (
              <ListWrapper key={list.id} list={list} />
            ))}
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default Lists;
