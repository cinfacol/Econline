import ThankYou from "@/components/Payment/thankyou";

export const metadata = {
  title: "Payment Details",
  description: "Payment Page in a Modern Ecommerce App",
};

const Payment = () => {
  return (
    <>
      <div className="bg-white">
        <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <ThankYou />
        </div>
      </div>
    </>
  );
};

export default Payment;
