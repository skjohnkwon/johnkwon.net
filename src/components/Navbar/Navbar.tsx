import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import DarkModeToggle from "../DarkModeButton/DarkModeToggle";

interface NavbarItems {
  title: string;
  link?: string;
  isDropdown?: boolean;
  dropdownItems?: NavbarItems[];
}

const navbarItems: NavbarItems[] = [
  { title: "github", link: "https://github.com/skjohnkwon" },
  { title: "linkedin", link: "https://www.linkedin.com/in/jung-ho-kwon/" },
  {
    title: "resume",
    link: "https://docs.google.com/document/d/1STD2EDd2iBYpMHL3gxBeMLANmx4cBMKN/edit?usp=sharing&ouid=100261606684662946327&rtpof=true&sd=true",
  },
  {
    title: "my music",
    isDropdown: true,
    dropdownItems: [
      { title: "soundcloud", link: "https://soundcloud.com/typhoondll" },
      { title: "youtube", link: "https://www.youtube.com/c/prodtyphoon" },
    ],
  },
];

const FullNavbar = () => {
  return (
    <div className="pl-5 p-3 space-x-4 text-xl dark:bg-gray-900 dark:text-white">
      <p className="inline cursor-default font-bold italic dark:text-white">
        john kwon
      </p>
      {navbarItems.map((item, index) => (
        <React.Fragment key={index}>
          <span className="ml-1 dark:text-white">+</span>
          {item.isDropdown ? (
            <div className="inline-flex">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-xl dark:text-white">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="text-gray-400 flex flex-col gap-3 p-2 w-auto dark:bg-gray-900 dark:text-gray-400 rounded-lg">
                      {item.dropdownItems?.map((dropdownItem, i) => (
                        <NavigationMenuLink key={i}>
                          <a
                            className="navbar-link generic-hover"
                            target="_blank"
                            href={dropdownItem.link}
                          >
                            {dropdownItem.title}
                          </a>
                        </NavigationMenuLink>
                      ))}
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          ) : (
            <>
              <a
                href={item.link}
                target="_blank"
                className="navbar-link generic-hover"
              >
                {item.title}
              </a>
            </>
          )}
        </React.Fragment>
      ))}
      <DarkModeToggle />
    </div>
  );
};

const MobileNavbar = () => {
  return (
    <>
      <div className="p-4 space-y-2 bg-gray-100 dark:bg-gray-800 dark:text-white flex flex-col">
        {navbarItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.dropdownItems ? (
              <div className="">
                <div className="space-y-2 flex flex-col">
                  {item.dropdownItems.map((dropdownItem, i) => (
                    <a
                      key={i}
                      href={dropdownItem.link}
                      target="_blank"
                      className="navbar-link generic-hover"
                    >
                      + {dropdownItem.title}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                href={item.link}
                target="_blank"
                className="navbar-link generic-hover"
              >
                + {item.title}
              </a>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="hidden lg:block">
        <FullNavbar />
      </div>
      <div className="block lg:hidden mb-5">
        <div
          className="flex justify-between items-center cursor-pointer text-xl dark:bg-gray-950 dark:text-white p-5"
          onClick={toggleMenu}
        >
          <p className="font-bold italic">
            john kwon{"  "}
            <DarkModeToggle></DarkModeToggle>
          </p>
          <span className="text-xl">{isOpen ? "-" : "+"}</span>
        </div>
        {isOpen && <MobileNavbar />}
      </div>
    </div>
  );
};

export default Navbar;
