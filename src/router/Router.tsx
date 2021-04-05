import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useStoreState } from "../store/hooks";
import { IRoute } from "./config";

interface IProps {
  routes: IRoute[];
}

const RouteWithSubRoutes = (route: IRoute) => {
  const authenticated = useStoreState((state) => state.auth.user) !== null;

  return (
    <Suspense fallback={route.fallback ?? ""}>
      {route.path && (
        <Route
          path={route.path}
          exact={route.exact}
          render={(props) =>
            route.redirect ? (
              <Redirect to={route.redirect} />
            ) : route.requiresAuth ? (
              authenticated ? (
                route.component && (
                  <route.component {...props} routes={route.routes} />
                )
              ) : (
                <Redirect to="/login" />
              )
            ) : (
              route.component && (
                <route.component {...props} routes={route.routes} />
              )
            )
          }
        />
      )}
    </Suspense>
  );
};

const Router: React.FC<IProps> = ({ routes }) => (
  <>
    <Switch>
      {routes.map((route: IRoute, i) => (
        <RouteWithSubRoutes key={i} {...route} />
      ))}
      <Route component={() => <h1>Not Found!</h1>} />
    </Switch>
  </>
);

export default Router;
