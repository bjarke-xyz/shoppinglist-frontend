import { createContext, useContext, useState } from "react";
import { Children } from "../types/children";

export type View = "home" | "items";
interface AppPage {
  view: View;
  setView: (v: View) => any;
}
const defaultAppPage: AppPage = {
  view: "home",
  setView: () => {},
};

export const appPageContext = createContext<AppPage>(defaultAppPage);

export const useAppPage = () => {
  return useContext(appPageContext);
};

export const AppPageProvider: React.FC<Children> = (props) => {
  const [view, setView] = useState<View>(defaultAppPage.view);
  function setViewWrapper(v: View) {
    console.log({ v });
    setView(v);
  }
  return (
    <appPageContext.Provider value={{ view, setView: setViewWrapper }}>
      {props.children}
    </appPageContext.Provider>
  );
};
