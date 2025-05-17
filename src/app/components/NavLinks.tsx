import React from "react";
import Link from "next/link";

const NavLinks = () => (
  <div className="hidden md:flex items-center space-x-6">
    <Link href="#Before-After" className="text-sm font-medium hover:text-gray-600">
      Before & After
    </Link>
    <Link href="#how-it-works" className="text-sm font-medium hover:text-gray-600">
      How It Works
    </Link>
    <Link href="#pricing" className="text-sm font-medium hover:text-gray-600">
      Pricing
    </Link>
  </div>
);

export default NavLinks;
