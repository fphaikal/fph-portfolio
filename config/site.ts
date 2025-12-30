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
  title: "Fahreza Pasha Haikal - IT Support Specialist & Full Stack Developer",
  description: "Portfolio of Fahreza Pasha Haikal (FPHaikal), an IT Support Specialist and Mechatronics Engineering student passionate about full-stack development, automation, and creating immersive digital experiences.",
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
  ogImage: "https://www.fph.my.id/og-image.png",
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
