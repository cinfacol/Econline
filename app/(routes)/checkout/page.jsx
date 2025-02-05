import CheckoutDetails from "@/components/checkout/CheckoutDetails";

export const metadata = {
  title: "Checkout Details",
  description: "Products Page in a Modern Ecommerce App",
};

async function Checkout() {
  return (
    <>
      <div className="bg-white">
        <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Check Out
          </h1>
          <CheckoutDetails />
        </div>
      </div>
    </>
  );
}

export default Checkout;
