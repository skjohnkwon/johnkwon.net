import React from "react";
import { Link } from "react-router-dom";
import DarkModeToggle from "../DarkModeButton/DarkModeToggle";
import Glass from "../Glass/Glass";

interface NavbarItem {
  title: string;
  link: string;
}

const navbarItems: NavbarItem[] = [
  { title: "github", link: "https://github.com/skjohnkwon" },
  { title: "linkedin", link: "https://www.linkedin.com/in/jung-ho-kwon/" },
  {
    title: "resume",
    link: "https://docs.google.com/document/d/1STD2EDd2iBYpMHL3gxBeMLANmx4cBMKN/edit?usp=sharing&ouid=100261606684662946327&rtpof=true&sd=true",
  },
];

// One line, left-aligned, small enough that it never needs a hamburger.
const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 z-50 p-4 sm:p-6">
      <Glass
        radius="pill"
        tintOpacity={0.42}
        warp
        layer="overlay"
        className="px-5 py-2.5"
      >
        <nav className="flex items-center gap-x-2 text-sm text-gray-800 dark:text-gray-200">
          <Link
            to="/"
            className="font-bold italic text-gray-900 dark:text-white generic-hover"
          >
            john kwon
          </Link>
          {navbarItems.map((item) => (
            <React.Fragment key={item.title}>
              <span className="text-gray-500/70 dark:text-gray-400/70">/</span>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="navbar-link generic-hover"
              >
                {item.title}
              </a>
            </React.Fragment>
          ))}
          <span className="text-gray-500/70 dark:text-gray-400/70">/</span>
          <DarkModeToggle />
        </nav>
      </Glass>
    </header>
  );
};

export default Navbar;
