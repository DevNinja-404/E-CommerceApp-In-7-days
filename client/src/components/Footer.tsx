import { motion, useScroll, useTransform } from "motion/react";

import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Footer = () => {
  // const { scrollY } = useScroll();
  // const scale = useTransform(scrollY, [0, 50], [0, 1]);
  // const opacity = useTransform(scrollY, [0, 50], [0.5, 1]);

  const socials = [
    {
      name: "X/Twitter",
      src: <FaXTwitter />,
    },
    {
      name: "Facebook",
      src: <FaFacebook />,
    },
    {
      name: "Youtube",
      src: <FaYoutube />,
    },
    {
      name: "Instagram",
      src: <RiInstagramFill />,
    },
  ];

  const links = [
    {
      name: "About",
      to: "/about",
    },
    {
      name: "Contact",
      to: "/contact",
    },
    {
      name: "FAQs",
      to: "/frequently-asked-questions",
    },
  ];

  return (
    <motion.div
      className="bg-slate-900 w-full rounded-t-lg grid md:grid-cols-4 lg:grid-cols-4 p-10 place-content-center space-y-10 md:space-y-0 space-x-4"
      // style={{ scale, opacity }}
    >
      <div className="text-white  md:ml-10 text-2xl font-semibold flex items-center">
        <Link to="">ShopUp</Link>
      </div>
      <div className="text-white">
        <ul className="flex flex-col gap-y-2 h-full justify-center">
          {socials.map((social, index) => (
            <li
              key={index}
              className="flex gap-x-2 items-center hover:underline cursor-pointer "
            >
              {social.src}
              <span>{social.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-white ">
        <ul className="flex flex-col gap-y-2 justify-center h-full ">
          {links.map((link, index) => (
            <li key={index} className="hover:underline">
              <Link to={link.to}>{link.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-white flex flex-col items-center justify-center text-xl">
        ShopUp &copy;-2025{" "}
        <span className="text-base"> All rights reserved</span>
      </div>
    </motion.div>
  );
};
