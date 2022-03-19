import { useKeycloak } from "@react-keycloak/web";
import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "../components/common/Loading";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { keycloak } = useKeycloak();
  const location = useLocation();
  if (!keycloak.authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return keycloak.authenticated ? children : null;
}

const Index = lazy(() => import("../pages/Index"));
const Home = lazy(() => import("../pages/Home"));
const Lists = lazy(() => import("../pages/Lists"));
const Items = lazy(() => import("../pages/Items"));
const Login = lazy(() => import("../pages/LoginPage"));
const User = lazy(() => import("../pages/User"));

const Router: React.FC = () => (
  <Routes>
    <Route
      path="/"
      element={
        <Suspense fallback={<Loading />}>
          <Index />
        </Suspense>
      }
    />
    <Route
      path="/home"
      element={
        <RequireAuth>
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        </RequireAuth>
      }
    />
    <Route
      path="/lists"
      element={
        <RequireAuth>
          <Suspense fallback={<Loading />}>
            <Lists />
          </Suspense>
        </RequireAuth>
      }
    />
    <Route
      path="/items"
      element={
        <RequireAuth>
          <Suspense fallback={<Loading />}>
            <Items />
          </Suspense>
        </RequireAuth>
      }
    />
    <Route
      path="/user"
      element={
        <RequireAuth>
          <Suspense fallback={<Loading />}>
            <User />
          </Suspense>
        </RequireAuth>
      }
    />
    <Route
      path="/login"
      element={
        <Suspense fallback={<Loading />}>
          <Login />
        </Suspense>
      }
    />
    <Route path="*" element={<h1>Not found!</h1>} />
  </Routes>
);

export default Router;
