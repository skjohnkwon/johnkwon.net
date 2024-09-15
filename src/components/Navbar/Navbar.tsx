import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import DarkModeToggle from "../DarkModeButton/DarkModeToggle";

const Navbar = () => {
  return (
    <div className="pl-5 p-3 space-x-4 text-xl dark:bg-gray-900 dark:text-white">
      <p className="inline cursor-default font-bold italic dark:text-white">
        john kwon
      </p>
      <span className="ml-1 dark:text-white">+</span>
      <a
        href="https://github.com/skjohnkwon"
        target="_blank"
        className="navbar-link generic-hover"
      >
        github
      </a>
      <span className="ml-1 dark:text-white">+</span>
      <a
        href="https://www.linkedin.com/in/jung-ho-kwon/"
        target="_blank"
        className="navbar-link generic-hover"
      >
        linkedin
      </a>
      <span className="ml-1 dark:text-white">+</span>
      <a
        href="https://docs.google.com/document/d/1STD2EDd2iBYpMHL3gxBeMLANmx4cBMKN/edit?usp=sharing&ouid=100261606684662946327&rtpof=true&sd=true"
        target="_blank"
        className="navbar-link generic-hover"
      >
        resume
      </a>
      <span className="ml-1 dark:text-white">+</span>
      <div className="inline-flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-xl dark:text-white">
                my music
              </NavigationMenuTrigger>
              <NavigationMenuContent className="text-gray-400 flex flex-col gap-3 p-2 w-auto dark:bg-gray-900 dark:text-gray-400 rounded-lg">
                <NavigationMenuLink>
                  <a
                    className="navbar-link generic-hover"
                    target="_blank"
                    href="https://soundcloud.com/typhoondll"
                  >
                    soundcloud
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink>
                  <a
                    className="navbar-link generic-hover"
                    target="_blank"
                    href="https://www.youtube.com/c/prodtyphoon"
                  >
                    youtube
                  </a>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <DarkModeToggle />
    </div>
  );
};

export default Navbar;
