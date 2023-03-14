import Navbar from "./Navbar";
import Footer from "./Footer";
import React from "react";
import Box from '@mui/material/Box';

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
