/* eslint-disable no-alert */
import React from "react";
import { Button, message } from "antd";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import PageContainer from "../components/common/PageContainer";
import EmojiHeader from "../components/common/EmojiHeader";
import { useStoreDispatch, useStoreState } from "../store/hooks";

const User: React.FC = () => {
  const user = useStoreState((state) => state.auth.user);
  const dispatch = useStoreDispatch();

  return (
    <>
      <PageContainer className="mx-auto max-w-3xl flex flex-col justify-between">
        <EmojiHeader src="/img/emoji/waving-hand.svg" title="" />

        <p>Hi {user?.preferred_username}</p>

        <div className="flex justify-between space-x-2">
          <Button
            block
            type="primary"
            icon={<LogoutOutlined />}
            onClick={() => dispatch.auth.logout()}
          >
            Logout
          </Button>
          <Button
            block
            disabled
            type="dashed"
            icon={<SettingOutlined />}
            onClick={() => message.warn("TODO")}
          >
            Settings
          </Button>
        </div>
      </PageContainer>
    </>
  );
};

export default User;
