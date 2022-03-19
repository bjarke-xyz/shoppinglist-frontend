import { useKeycloak } from "@react-keycloak/web";
import "antd/dist/antd.css";
import { useEffect, useState } from "react";
import "./App.css";
import Loading from "./components/common/Loading";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Router from "./router/Router";
import { useStoreDispatch, useStoreState } from "./store/hooks";

function App() {
  const { keycloak } = useKeycloak();
  const loaded = useStoreState((state) => state.core.loaded);
  const defaultListFetched = useStoreState(
    (state) => state.lists.defaultListFetched
  );
  const dispatch = useStoreDispatch();

  const [fetchSuccess, setFetchSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (keycloak.authenticated && !fetchSuccess) {
        const [success, err] = await dispatch.fetcher();
        dispatch.core.sseConnect();
        if (err) {
          // eslint-disable-next-line no-console
          console.log("Could not get data: ", err);
        }
        if (success) {
          setFetchSuccess(true);
        }
      } else {
        dispatch.core.setLoaded(true);
        setFetchSuccess(true);
      }
    }
    fetchData();
  }, [keycloak.authenticated, dispatch, fetchSuccess]);

  useEffect(() => {
    if (fetchSuccess) {
      dispatch.core.setLoaded(true);
    }
  }, [dispatch.core, defaultListFetched, fetchSuccess]);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto p-5">
        {loaded ? <Router /> : <Loading emoji />}
      </main>
      {keycloak.authenticated && <Footer />}
    </div>
  );
}

export default App;
