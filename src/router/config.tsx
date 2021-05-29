import { ComponentType, lazy, LazyExoticComponent, ReactNode } from "react";
import Loading from "../components/common/Loading";
import { LOGIN_URL } from "../utils/constants";

export interface IRoute {
  // Path, like in basic prop
  path?: string;

  /**
   * External URL
   */
  externalUrl?: string;

  // Exact, like in basic prop
  exact?: boolean;
  // Preloader for lazy loading
  fallback?: NonNullable<ReactNode> | null;
  // Lazy Loaded component
  component?: LazyExoticComponent<ComponentType<any>>;

  /**
   * Redirect path.
   *
   * If this is set, the route will not show up in nav.
   */
  redirect?: string;

  /**
   * If the route requires the user to be signed in.
   */
  requiresAuth?: boolean;

  /**
   * If the route requires the user to not be signed in.
   *
   * Primarily used in nav.
   */
  requiresNotAuth?: boolean;

  /**
   * Text to display in nav.
   */
  navName?: string;

  /**
   * If the route should be hidden in nav.
   */
  hidden?: boolean;

  routes?: IRoute[]; // TODO: sub routes not working for some reason
}

export const routes: IRoute[] = [
  {
    path: "/",
    component: lazy(() => import("../pages/Index")),
    exact: true,
    fallback: <Loading />,
    hidden: true,
  },
  {
    path: "/home",
    component: lazy(() => import("../pages/Home")),
    requiresAuth: true,
    fallback: <Loading />,
    navName: "Home",
  },
  {
    path: "/items",
    component: lazy(() => import("../pages/Items")),
    requiresAuth: true,
    fallback: <Loading />,
    navName: "Items",
  },
  {
    path: "/lists",
    component: lazy(() => import("../pages/Lists")),
    requiresAuth: true,
    fallback: <Loading />,
    navName: "Lists",
  },
  {
    path: "/login",
    component: lazy(() => import("../pages/LoginPage")),
    requiresNotAuth: true,
    fallback: <Loading />,
    hidden: true,
  },
  {
    path: "/user",
    component: lazy(() => import("../pages/User")),
    requiresAuth: true,
    fallback: <Loading />,
    navName: "User",
  },
  {
    externalUrl: LOGIN_URL,
    navName: "Login",
    requiresNotAuth: true,
  },
];
