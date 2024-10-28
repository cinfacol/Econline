import Container from "@/components/ui/container";
import CommonCats from "@/components/Categories/CommonCats";

export const revalidate = 0;

const CategoryPage = async props => {
  const params = await props.params;
  const categoryId = params.categoryId;

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <CommonCats categoryId={categoryId} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
