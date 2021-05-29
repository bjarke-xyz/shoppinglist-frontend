import "antd/dist/antd.css";
import _ from "lodash";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./App.css";
import Loading from "./components/common/Loading";
import Header from "./components/Header";
import { routes } from "./router/config";
import Router from "./router/Router";
import { useStoreDispatch, useStoreState } from "./store/hooks";

function App() {
  const history = useHistory();
  const location = useLocation();
  const user = useStoreState((state) => state.auth.user);
  const loaded = useStoreState((state) => state.core.loaded);
  const dispatch = useStoreDispatch();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    async function fetchData() {
      if (!loaded) {
        const sessionState = queryParams.get("session_state");
        const code = queryParams.get("code");
        const path = location.pathname;
        queryParams.delete("session_state");
        queryParams.delete("code");
        if (sessionState && code) {
          const error = await dispatch.auth.loginViaCode({ code, path });
          if (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            history.push("/login");
            dispatch.core.setLoaded(true);
            return;
          }
          history.replace({
            search: queryParams.toString(),
          });
        }

        if (!user) {
          const [success, err] = await dispatch.fetcher();
          if (!success && path !== "/") {
            if (_.isArray(err)) {
              if (err.some((x) => x?.code === 401)) {
                history.push("/login");
              }
            } else {
              // if err is not array, it must be SSOError
              history.push("/login");
            }
          }
        }
      }
      dispatch.core.setLoaded(true);
    }
    fetchData();
  });
  return (
    <>
      <Header />
      <div className="container mx-auto min-w-min px-2 py-2">
        {loaded ? <Router routes={routes} /> : <Loading emoji />}
      </div>
    </>
  );
}

export default App;
