import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  //NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  //NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  return (
    <div className="pl-5 p-3 space-x-4 text-xl">
      <p className="inline cursor-default font-bold italic">john kwon</p>
      <span className="ml-1">|</span>
      <a
        href="https://github.com/skjohnkwon"
        target="_blank"
        className="navbar-link"
      >
        github
      </a>
      <span className="ml-1">|</span>
      <a
        href="https://www.linkedin.com/in/jung-ho-kwon/"
        target="_blank"
        className="navbar-link"
      >
        linkedin
      </a>
      <span className="ml-1">|</span>
      <a
        href="https://docs.google.com/document/d/1STD2EDd2iBYpMHL3gxBeMLANmx4cBMKN/edit?usp=sharing&ouid=100261606684662946327&rtpof=true&sd=true"
        target="_blank"
        className="navbar-link"
      >
        resume
      </a>
      <span className="ml-1">|</span>
      <div className="inline-flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-xl">
                my music
              </NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col gap-3 p-6 w-auto">
                <NavigationMenuLink>
                  <a
                    className="navbar-link"
                    target="_blank"
                    href="https://soundcloud.com/typhoondll"
                  >
                    soundcloud
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink>
                  <a
                    className="navbar-link"
                    target="_blank"
                    href="https://www.youtube.com/c/prodtyphoon"
                  >
                    youtube
                  </a>
                </NavigationMenuLink>
                {/* <NavigationMenuLink>
                  <a
                    className="navbar-link"
                    target="_blank"
                    href="https://soundcloud.com/typhoondll"
                  >
                    beatstars
                  </a>
                </NavigationMenuLink> */}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Navbar;
