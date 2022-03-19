import { BarsOutlined, HomeOutlined, TagsOutlined } from "@ant-design/icons";
import { ComponentType, lazy, LazyExoticComponent, ReactNode } from "react";
import Loading from "../components/common/Loading";

export interface IRoute {
  // Path, like in basic prop
  path?: string;

  /**
   * External URL
   */
  externalUrl?: string;

  // Preloader for lazy loading
  Fallback: NonNullable<ReactNode>;
  // Lazy Loaded component
  Component?: LazyExoticComponent<ComponentType<any>>;

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

  topNav?: boolean;

  Icon?: React.ReactNode;
}

export const routes: IRoute[] = [
  {
    path: "/",
    Component: lazy(() => import("../pages/Index")),
    Fallback: <Loading />,
    hidden: true,
  },
  {
    path: "/home",
    Component: lazy(() => import("../pages/Home")),
    requiresAuth: true,
    Fallback: <Loading />,
    navName: "Home",
    Icon: <HomeOutlined />,
  },
  {
    path: "/lists",
    Component: lazy(() => import("../pages/Lists")),
    requiresAuth: true,
    Fallback: <Loading />,
    navName: "Lists",
    Icon: <BarsOutlined />,
  },
  {
    path: "/items",
    Component: lazy(() => import("../pages/Items")),
    requiresAuth: true,
    Fallback: <Loading />,
    navName: "Items",
    Icon: <TagsOutlined />,
  },
  {
    path: "/login",
    Component: lazy(() => import("../pages/LoginPage")),
    requiresNotAuth: true,
    navName: "Login",
    Fallback: <Loading />,
  },
  {
    path: "/user",
    Component: lazy(() => import("../pages/User")),
    requiresAuth: true,
    Fallback: <Loading />,
    navName: "User",
    topNav: true,
  },
];
