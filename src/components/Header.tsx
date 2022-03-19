import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { Link } from "react-router-dom";
import { useStoreState } from "../store/hooks";
import EmojiHeader from "./common/EmojiHeader";

const Header: React.FC = () => {
  const defaultList = useStoreState((state) => state.lists.defaultList);
  const { keycloak } = useKeycloak();
  return (
    <>
      <header className="shadow py-5 px-2 bg-white  text-center flex flex-row justify-between align-middle">
        <Link to={keycloak.authenticated ? "/home" : "/"} className="block">
          <span className="sr-only">Shopping List</span>
          <img
            className="h-8"
            src="/img/emoji/shoppingcart.svg"
            alt="Shopping List Logo"
            title="Shopping List"
          />
        </Link>
        {defaultList && (
          <div>
            <EmojiHeader
              horiz
              small
              src="/img/emoji/memo.svg"
              title={defaultList?.name ?? "No default list chosen yet"}
            />
          </div>
        )}
        <Link to={keycloak.authenticated ? "/user" : "/login"}>
          <span className="sr-only">Profile</span>
          <img
            className="h-8"
            title="Profile settings"
            alt="Profile logo"
            src="/img/emoji/bust-in-silhouette.svg"
          />
        </Link>
      </header>
    </>
  );
};

export default Header;
