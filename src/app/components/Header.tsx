import React from "react";
import NavLinks from "./NavLinks";
import AuthButtons from "./AuthButtons";

const Header = () => (
  <header className="container mx-auto m-4 py-4 px-4 sticky top-0 z-50 bg-white shadow-sm rounded-full transition-all duration-300 ease-in-out">
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-2xl font-bold focus:outline-none"
        >
          pfp.fm
        </button>
        <NavLinks />
      </div>
      <AuthButtons />
    </nav>
  </header>
);

export default Header;
