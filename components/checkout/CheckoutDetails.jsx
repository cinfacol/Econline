"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import cloudinaryImageLoader from "@/actions/imageLoader";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import Currency from "@/components/ui/currency";
import ShippingForm from "@/components/checkout/ShippingForm";
import { Spinner } from "@/components/common";
// import { Button } from "@heroui/button";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import {
  useGetItemsQuery,
  useGetShippingOptionsQuery,
} from "@/redux/features/cart/cartApiSlice";
import { useCheckCouponMutation } from "@/redux/features/cart/cartApiSlice";
import {
  useGetClientTokenQuery,
  useProcessPaymentMutation,
} from "@/redux/features/payment/paymentApiSlice";
import DropIn from "braintree-web-drop-in-react";
import { toast } from "sonner";
import { countries } from "@/helpers/fixedCountries";

const CheckoutDetails = () => {
  const dispatch = useDispatch();
  const [checkCoupon] = useCheckCouponMutation();
  const router = useRouter();
  const { data: user } = useRetrieveUserQuery();
  const { data } = useGetItemsQuery();
  const { data: shippingData } = useGetShippingOptionsQuery("shipping");

  const { data: tokenData } = useGetClientTokenQuery();

  const clientToken = tokenData;

  // Destructure data and handle empty cart case concisely
  const { ids: Ids = [], entities: Enty = {} } = shippingData || {};

  // Calculate shipping items
  const shipping = Ids.map((id) => Enty[id] || null).filter(Boolean);

  // Destructure data and handle empty cart case concisely
  const { ids = [], entities = {} } = data || {};

  // Calculate cart items
  const items = ids.map((id) => entities[id] || null).filter(Boolean);

  // const refresh = useSelector(state => state.auth.refresh)
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  // const loading = useSelector((state) => state.payment.status);
  const loading = false;
  /* const {
    clientToken,
    made_payment,
    total_after_coupon,
    total_amount,
    total_compare_amount,
    estimated_tax,
    shipping_cost,
  } = useSelector((state) => state.payment); */

  // const coupon = useSelector((state) => state.coupons.coupon);

  const [formData, setFormData] = useState({
    full_name: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state_province_region: "",
    postal_zip_code: "",
    country_region: "Colombia",
    telephone_number: "",
    coupon_name: "",
    shipping_id: 0,
    shipping_cost: 0,
  });

  // eslint-disable-next-line no-unused-vars
  /* const [data, setData] = useState({
    instance: {},
  }); */

  const {
    full_name,
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    postal_zip_code,
    country_region,
    telephone_number,
    coupon_name,
    shipping_id,
    shipping_cost,
  } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* const buy = async (e) => {
    e.preventDefault();
    let nonce = await data.instance.requestPaymentMethod();

    if (coupon && coupon !== null && coupon !== undefined) {
      const coupon_name = coupon.name;
      dispatch(
        process_payment({
          nonce,
          shipping_id,
          coupon_name,
          full_name,
          address_line_1,
          address_line_2,
          city,
          state_province_region,
          postal_zip_code,
          country_region,
          telephone_number,
        })
      )
        .unwrap()
        .then((payload) =>
          toast.success("El pago fue exitoso y se ha creado la orden")
        )
        .catch((error) => toast.error(`${error.error}`));
    } else {
      dispatch(
        process_payment({
          nonce,
          shipping_id,
          coupon_name: "",
          full_name,
          address_line_1,
          address_line_2,
          city,
          state_province_region,
          postal_zip_code,
          country_region,
          telephone_number,
        })
      )
        .unwrap()
        .then((payload) =>
          toast.success("El pago fue exitoso y se ha creado la orden")
        )
        .catch((error) => toast.error(`${error.error}`));
    }
  }; */

  const apply_coupon = async (e) => {
    e.preventDefault();

    dispatch(checkCoupon(coupon_name));
  };

  /* useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(get_shipping_options());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); */

  /* useEffect(() => {
    dispatch(get_client_token());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); */

  /* useEffect(() => {
    // const defecto = 'default';
    if (coupon && coupon !== null && coupon !== undefined)
      dispatch(get_payment_total({ shipping_id, coupon_name }));
    else dispatch(get_payment_total({ shipping_id, coupon_name: "default" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipping_id, coupon]); */

  // const [render, setRender] = useState(false);

  const renderShipping = () => {
    return (
      <div className="mb-5">
        {shipping &&
          shipping !== null &&
          shipping !== undefined &&
          shipping.length !== 0 &&
          shipping.map((shipping_option, index) => (
            <div key={index}>
              <input
                onChange={(e) => onChange(e)}
                value={shipping_option.price}
                name="shipping_cost"
                type="radio"
                required
              />
              <label className="ml-4">
                {shipping_option.name} - ${shipping_option.price} (
                {shipping_option.time_to_delivery})
              </label>
            </div>
          ))}
      </div>
    );
  };

  const renderPaymentInfo = () => {
    if (!clientToken) {
      if (!isAuthenticated) {
        <Link
          href="/auth/login"
          className="w-full bg-gray-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
        >
          Login
        </Link>;
      } else {
        <button className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
          <Spinner />
        </button>;
      }
    } else {
      return (
        <>
          <DropIn
            options={{
              authorization: clientToken,
              paypal: {
                flow: "vault",
              },
            }}
            onInstance={(instance) => (data.instance = instance)}
          />
          <div className="mt-6">
            {loading === "pending" ? (
              <button className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
                <Spinner />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-green-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-500"
              >
                Place Order
              </button>
            )}
          </div>
        </>
      );
    }
  };

  // if (made_payment) return router.push("/thankyou");

  return (
    <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
      <section aria-labelledby="cart-heading" className="lg:col-span-7">
        <h2 id="cart-heading" className="sr-only">
          Items in your shopping cart
        </h2>
        <div className="space-y-2">
          {ids?.map((id) => {
            const Item = entities[id];
            const inventoryId = Item?.inventory?.id;

            return (
              <div
                key={Item.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
              >
                <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                  <Link
                    href={`/product/${inventoryId}`}
                    className="shrink-0 md:order-1"
                  >
                    <Image
                      loader={cloudinaryImageLoader}
                      src={Item?.inventory?.image[0].image}
                      alt={Item?.inventory?.image[0].alt_text}
                      width="100"
                      height="100"
                      className="aspect-square object-fill rounded-md"
                      sizes="100px"
                    />
                  </Link>

                  <label htmlFor="counter-input" className="sr-only">
                    Quantity:
                  </label>
                  <div className="flex items-center justify-between md:order-3 md:justify-end">
                    <div className="flex items-center">
                      <input
                        type="text"
                        id="counter-input"
                        onChange={() => {}}
                        data-input-counter
                        className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                        placeholder=""
                        value={Item?.quantity}
                        required
                      />
                    </div>
                    <div className="text-end md:order-4 md:w-32">
                      <div className="text-base font-bold text-gray-900 dark:text-white">
                        <Currency
                          value={Item?.inventory?.store_price * Item?.quantity}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                    <Link
                      href={`/product/${inventoryId}`}
                      className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                    >
                      <span className="px-2 font-semibold text-lg">
                        {Item?.inventory?.product?.name}
                      </span>
                      <p className="px-2 text-sm text-gray-500 line-clamp-2">
                        {Item?.inventory?.product?.description}
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Order summary */}

      <ShippingForm
        full_name={full_name}
        address_line_1={address_line_1}
        address_line_2={address_line_2}
        city={city}
        state_province_region={state_province_region}
        postal_zip_code={postal_zip_code}
        telephone_number={telephone_number}
        countries={countries}
        onChange={onChange}
        // buy={buy}
        user={user}
        renderShipping={renderShipping}
        // total_amount={total_amount}
        // total_after_coupon={total_after_coupon}
        // total_compare_amount={total_compare_amount}
        // estimated_tax={estimated_tax}
        // shipping_cost={shipping_cost}
        shipping_id={shipping_id}
        shipping_cost={shipping_cost}
        shipping={shipping}
        renderPaymentInfo={renderPaymentInfo}
        // coupon={coupon}
        apply_coupon={apply_coupon}
        // coupon_name={coupon_name}
      />
    </div>
  );
};

export default CheckoutDetails;
