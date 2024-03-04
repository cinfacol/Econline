"use client";

import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";
import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import SuggestedProducts from "@/components/inventories/SuggestedProducts";
import { Spinner } from "@/components/common";

export const revalidate = 0;
// Aquí necesitamos pasarle al componente SuggestedProducts, el slug de la categoría con el id
// que viene en los parámetros.
const CategoryPage = async ({ params, searchParams }) => {
  const category_id = params.categoryId;

  const inventories = useGetInventoriesQuery("getInventories", {
    selectFromResult: ({ data }) => ({
      data_ids: data?.ids,
      entities: data?.entities,
    }),
  });

  // Filtrar por categoría y obtener entidades
  const filteredInventories = inventories?.data_ids
    ?.map((inventoryId) => {
      const entity = inventories?.entities[inventoryId];
      const matchCategory = entity?.product?.category?.find(
        (category) => category.id === category_id
      );

      if (matchCategory) {
        return entity;
      }
      return null;
    })
    .filter((entity) => entity !== null);

  // Mostrar los datos del inventario
  if (!filteredInventories)
    return (
      <div className="mt-5">
        <Spinner lg />.
      </div>
    );

  if (filteredInventories?.length === 0)
    return <div>No hay productos para la categoría</div>;

  const cat_name = filteredInventories?.[0]?.product?.category?.map(
    (filtered) => filtered?.slug
  );

  const category = useGetCategoriesQuery("getCategories");

  const categories = category?.data?.results?.filter((cat) => {
    return cat.id === category_id; // Retornar la categoría que coincida con el ID
  });

  const slug = categories?.slug; // Obtener el slug de la categoría encontrada

  const category_name = categories?.[0]?.name;
  return (
    <div className="bg-white">
      <Container>
        {/* <Billboard data={category.billboard} /> */}
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {/* {products.length === 0 && <NoResults />} */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* {products.map((item) => (
                  <ProductCard key={item.id} data={item} />
                ))} */}
              </div>
              <SuggestedProducts
                title={`Related by: ${category_name}`}
                categories={cat_name}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
