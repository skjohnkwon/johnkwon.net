import React from "react";
import { Link } from "react-router-dom";

interface NavbarItem {
  title: string;
  link: string;
}

const navbarItems: NavbarItem[] = [
  { title: "github", link: "https://github.com/skjohnkwon" },
  { title: "linkedin", link: "https://www.linkedin.com/in/jung-ho-kwon/" },
  {
    title: "resume",
    link: "https://docs.google.com/document/d/12t84q5KZctJzQboS-AHVJs51zgLuW6bZ/edit?usp=sharing&ouid=100261606684662946327&rtpof=true&sd=true",
  },
];

// The first row of the panel. One line, small enough that it never needs a
// hamburger.
const Navbar: React.FC = () => {
  return (
    <header className="px-6 py-4 sm:px-10">
      <nav className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-base text-gray-800 dark:text-gray-200">
        <Link
          to="/"
          className="font-bold italic text-gray-900 dark:text-white generic-hover"
        >
          john kwon
        </Link>
        {navbarItems.map((item) => (
          <a
            key={item.title}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="navbar-link generic-hover"
          >
            {item.title}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
