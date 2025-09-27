import React from "react";
import { Facebook, Youtube, Instagram, Copyright } from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-blue-200 left-0 bottom-0 w-full px-10 py-6 grid md:grid-cols-3 grid-cols-1">
      <div className="flex items-center md:justify-start justify-center order-2 md:order-1 mt-3 md:mt-0">
        <Copyright /> <span className="ml-3">All Rights Reserved</span>
      </div>
      <div className="flex items-center justify-center gap-8 order-1 md:order-2">
        <Facebook className="hover:scale-110 duration-300" />
        <Instagram className="hover:scale-110 duration-300" />
        <Youtube className="hover:scale-110 duration-300" />
      </div>
      <div className="order-3"></div>
    </div>
  );
};

export default Footer;
