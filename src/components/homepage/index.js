import React from "react";
import CarouselLayout from "./carousel";
import SaleProduct from "./saleproduct";
import ListProduct from "./listpoduct";
import Blog from "./blog";

const Homepage = () => {
  return (
    <>
      <CarouselLayout />
      <SaleProduct />
      <ListProduct />
      <Blog />
    </>
  );
};

export default Homepage;