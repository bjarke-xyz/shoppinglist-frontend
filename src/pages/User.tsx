/* eslint-disable no-alert */
import React from "react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import EmojiHeader from "../components/common/EmojiHeader";
import { CogIcon, LogoutIcon } from "../components/common/Icons";
import { useStoreDispatch, useStoreState } from "../store/hooks";

const User: React.FC = () => {
  const user = useStoreState((state) => state.auth.user);
  const dispatch = useStoreDispatch();

  return (
    <>
      <Card className="mx-auto max-w-3xl flex flex-col justify-between">
        <EmojiHeader
          src="/img/emoji/waving-hand.svg"
          title={`Hi ${user?.preferred_username}`}
        />

        <div className="flex justify-between space-x-4">
          <Button
            outline
            icon={LogoutIcon}
            onClick={() => dispatch.auth.logout()}
            label="Logout"
          />
          <Button
            outline
            disabled
            icon={CogIcon}
            label="Settings"
            onClick={() => alert("todo")}
          />
        </div>
      </Card>
    </>
  );
};

export default User;
