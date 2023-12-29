"use client";

import CategoriesList from "@/components/Categories/CategoriesList";
import ProductsList from "@/components/products/ProductsList";

const ProductsPage = () => {
  return (
    <>
      <div>
        <div className="mg-top text-center">
          <h1>Our Catalog of Products and Categories</h1>
          <hr className="hr-text" />
        </div>
        <ProductsList />
        <CategoriesList />
      </div>
    </>
  );
};

export default ProductsPage;
