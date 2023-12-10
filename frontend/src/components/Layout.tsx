import React from "react";
import Header from "./Header";

const Layout = ({ children }: any) => {
  return (
    <>
      <Header />
      <main style={{ height:"100vh" ,backgroundColor: "#150633" }}>{children}</main>
    </>
  );
};

export default Layout;
