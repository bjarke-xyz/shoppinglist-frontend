import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useToCaptureClickOutside } from "../hooks/hooks";
import { routes } from "../router/config";
import { useStoreState } from "../store/hooks";

interface INavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
const Nav: React.FC<INavProps> = ({ isOpen, setIsOpen }) => {
  const user = useStoreState((state) => state.auth.user);
  return (
    <nav
      // eslint-disable-next-line prettier/prettier
      className={`absolute md:relative top-16 left-0 md:top-0 z-20 md:flex flex-col md:flex-row md:space-x-6 font-semibold w-full md:w-auto bg-white shadow-md md:shadow-none md:bg-transparent p-4 pt-0 md:p-0 ${isOpen ? "flex" : "hidden"
        // eslint-disable-next-line prettier/prettier
        }`}
    >
      {routes
        .filter((r) => !r.redirect)
        .filter((r) => (r.requiresAuth ? user : true))
        .filter((r) => (r.requiresNotAuth ? !user : true))
        .filter((r) => r.hidden === undefined || r.hidden === false)
        .map((route, i) =>
          route.externalUrl ? (
            <a key={i} href={route.externalUrl}>
              {route.navName}
            </a>
          ) : (
            <NavLink
              key={i}
              className="block py-1 text-gray-500 hover:underline"
              activeClassName="text-green-400"
              to={route.path || "ERROR"}
              onClick={() => setIsOpen(false)}
            >
              {route.navName}
            </NavLink>
          )
        )}
    </nav>
  );
};

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeOutsideNodeRef = useToCaptureClickOutside(isOpen, () =>
    setIsOpen(false)
  );

  return (
    <>
      <header
        ref={closeOutsideNodeRef}
        className="shadow flex flex-wrap flex-row justify-between md:items-center md:space-x-4 bg-white p-4 relative"
      >
        <Link to="/" className="block">
          <span className="sr-only">Shopping List</span>
          <img
            className="h-8"
            src="/img/emoji/shoppingcart.svg"
            alt="Shopping List Logo"
            title="Shopping List Logo"
          />
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-block rounded-sm md:hidden w-8 h-8 bg-gray-200 text-gray-600 p-1"
        >
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <Nav isOpen={isOpen} setIsOpen={setIsOpen} />
      </header>
    </>
  );
};

export default Header;
