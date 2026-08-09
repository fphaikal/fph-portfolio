export type SiteConfig = typeof siteConfig;
import { GoHomeFill, GoHome } from "react-icons/go";
import {
  RiBookletFill,
  RiBookletLine,
  RiGithubFill,
  RiInstagramFill,
} from "react-icons/ri";
import { AiFillSpotify, AiOutlineSpotify } from "react-icons/ai";

export const siteConfig = {
  name: "FPHaikal",
  fullName: "Fahreza Pasha Haikal",
  alternateNames: ["FPHaikal", "FPH", "Fahreza Haikal"],
  title: "Fahreza Pasha Haikal (FPHaikal) | IT Support & Full Stack Developer",
  description: "Official portfolio of Fahreza Pasha Haikal, also known as FPHaikal and FPH—an IT Support Specialist and full-stack developer in Indonesia.",
  keywords: [
    "Fahreza Pasha Haikal",
    "FPHaikal",
    "FPH",
    "IT Support Specialist",
    "Full Stack Developer",
    "Web Developer",
    "Mechatronics Engineering",
    "Next.js Developer",
    "React Developer",
    "Indonesia",
    "Portfolio"
  ],
  url: "https://www.fph.my.id",
  ogImage: "https://www.fph.my.id/opengraph-image",
  links: {
    github: "https://github.com/fphaikal",
    instagram: "https://instagram.com/fp_haikal",
    linkedin: "https://linkedin.com/in/fphaikal",
  },
  navItems: [
    {
      label: "Home",
      icon: GoHomeFill,
      activeIcon: GoHome,
      href: "/",
    },
    {
      label: "Blog",
      icon: RiBookletFill,
      activeIcon: RiBookletLine,
      href: "/blog",
    },
    {
      label: "Spotify",
      icon: AiFillSpotify,
      activeIcon: AiOutlineSpotify,
      href: "/spotify",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  socials: [
    {
      label: "Instagram",
      href: "https://instagram.com/fp_haikal",
      icon: RiInstagramFill,
    },
    {
      label: "GitHub",
      href: "https://github.com/fphaikal",
      icon: RiGithubFill,
    },
  ],
};
