import Navbar from "./Navbar";
import Footer from "./Footer";
import React from "react";

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
