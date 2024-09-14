import React from "react";
import { NavigationMenu, NavigationMenuContent, 
//NavigationMenuIndicator,
NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
//NavigationMenuViewport,
 } from "@/components/ui/navigation-menu";
const Navbar = () => {
    return (React.createElement("div", { className: "p-3 space-x-4" },
        React.createElement("p", { className: "inline cursor-default" }, "john kwon"),
        React.createElement("span", { className: "ml-1" }, "|"),
        React.createElement("a", { href: "https://github.com/skjohnkwon", target: "_blank", className: "navbar-link" }, "github"),
        React.createElement("span", { className: "ml-1" }, "|"),
        React.createElement("a", { href: "https://www.linkedin.com/in/jung-ho-kwon/", target: "_blank", className: "navbar-link" }, "linkedin"),
        React.createElement("span", { className: "ml-1" }, "|"),
        React.createElement("a", { href: "https://docs.google.com/document/d/1STD2EDd2iBYpMHL3gxBeMLANmx4cBMKN/edit?usp=sharing&ouid=100261606684662946327&rtpof=true&sd=true", target: "_blank", className: "navbar-link" }, "resume"),
        React.createElement("span", { className: "ml-1" }, "|"),
        React.createElement("div", { className: "inline-flex" },
            React.createElement(NavigationMenu, null,
                React.createElement(NavigationMenuList, null,
                    React.createElement(NavigationMenuItem, null,
                        React.createElement(NavigationMenuTrigger, { className: "text-base" }, "my music"),
                        React.createElement(NavigationMenuContent, { className: "flex flex-col gap-3 p-6 w-auto" },
                            React.createElement(NavigationMenuLink, null,
                                React.createElement("a", { className: "navbar-link", target: "_blank", href: "https://soundcloud.com/typhoondll" }, "soundcloud")),
                            React.createElement(NavigationMenuLink, null,
                                React.createElement("a", { className: "navbar-link", target: "_blank", href: "https://www.youtube.com/c/prodtyphoon" }, "youtube")),
                            React.createElement(NavigationMenuLink, null,
                                React.createElement("a", { className: "navbar-link", target: "_blank", href: "https://soundcloud.com/typhoondll" }, "beatstars")))))))));
};
export default Navbar;
