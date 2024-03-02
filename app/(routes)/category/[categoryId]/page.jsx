"use client";
import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";
import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import SuggestedProducts from "@/components/inventories/SuggestedProducts";

export const revalidate = 0;

const CategoryPage = async ({ params, searchParams }) => {
  const category_id = params.categoryId;
  const products = useGetInventoriesQuery("getInventories", {
    /* selectFromResult: {
      categoryId: params.categoryId,
    }, */
  });
  const categories = useGetCategoriesQuery("getCategories");
  const category = useGetCategoriesQuery("getCategories", {
    selectFromResult: ({ data }) => ({
      categories: data?.categories?.find((category) =>
        category.sub_categories?.filter(
          (sub_category) => sub_category?.id === category_id
        )
      ),
    }),
  });
  const category_name = category.categories?.name;
  return (
    <div className="bg-white">
      <Container>
        {/* <Billboard data={category.billboard} /> */}
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {products.length === 0 && <NoResults />}
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((item) => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div> */}
              <SuggestedProducts
                title={`Related with: ${category?.categories?.name}`}
                category={category_name}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
