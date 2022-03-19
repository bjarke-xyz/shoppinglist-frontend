/* eslint-disable no-alert */
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "antd";
import React from "react";
import EmojiHeader from "../components/common/EmojiHeader";
import PageContainer from "../components/common/PageContainer";
import { useStoreState } from "../store/hooks";
import { FRONTEND_URL } from "../utils/constants";

const User: React.FC = () => {
  const user = useStoreState((state) => state.auth.user);
  const { keycloak } = useKeycloak();

  return (
    <>
      <PageContainer className="mx-auto max-w-3xl flex flex-col justify-between">
        <EmojiHeader src="/img/emoji/waving-hand.svg" title="" />

        <p>Hi {user?.name}</p>

        <div className="flex justify-between space-x-2">
          <Button
            block
            type="primary"
            icon={<LogoutOutlined />}
            onClick={() =>
              keycloak.logout({
                redirectUri: `${FRONTEND_URL}/`,
              })
            }
          >
            Logout
          </Button>
          <Button
            block
            icon={<SettingOutlined />}
            onClick={() => keycloak.accountManagement()}
          >
            Settings
          </Button>
        </div>
      </PageContainer>
    </>
  );
};

export default User;
