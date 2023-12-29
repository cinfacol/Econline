"use client";

import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";

const CategoriesList = () => {
  const {
    data: categories,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCategoriesQuery("getCategories");
  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    content = categories.categories.map((category) => {
      return <div key={category.id}>{category.name}</div>;
    });
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h1 className="py-3">Categories</h1>
      {content}
    </section>
  );
};

export default CategoriesList;
