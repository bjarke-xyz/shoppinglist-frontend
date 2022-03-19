import { useKeycloak } from "@react-keycloak/web";
import { NavLink } from "react-router-dom";
import { routes } from "../router/config";

const Footer: React.FC = () => {
  const { keycloak } = useKeycloak();
  const navLinkClassNames =
    "text-gray-500 hover:underline flex flex-col justify-center items-center";
  return (
    <nav className="shadow py-1 bg-white flex justify-around">
      {routes
        .filter((r) => !r.redirect)
        .filter((r) => (r.requiresAuth ? keycloak.authenticated : true))
        .filter((r) => (r.requiresNotAuth ? !keycloak.authenticated : true))
        .filter((r) => r.hidden === undefined || r.hidden === false)
        .filter((r) => !r.topNav)
        .map((route, i) =>
          route.externalUrl ? (
            <a key={i} href={route.externalUrl}>
              {route.navName}
            </a>
          ) : (
            <NavLink
              key={i}
              className={({ isActive }) =>
                isActive
                  ? `text-green-400 ${navLinkClassNames}`
                  : navLinkClassNames
              }
              to={route.path || "ERROR"}
            >
              <span className="block text-2xl">{route.Icon && route.Icon}</span>
              <span>{route.navName}</span>
            </NavLink>
          )
        )}
    </nav>
  );
};

export default Footer;
