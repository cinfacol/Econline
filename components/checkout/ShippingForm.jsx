import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { TicketIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import Link from "next/link";
import { CheckoutForm } from "@/components/forms";

const ShippingForm = ({
  full_name,
  address_line_1,
  address_line_2,
  city,
  state_province_region,
  postal_zip_code,
  telephone_number,
  countries,
  onChange,
  buy,
  user,
  // profile,
  // renderShipping,
  original_price,
  total_amount,
  total_compare_amount,
  estimated_tax,
  shipping_cost,
  shipping_id,
  shipping,
  renderPaymentInfo,
  apply_coupon,
  coupon,
  coupon_name,
  total_after_coupon,
}) => {
  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
    >
      <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
        Order summary
      </h2>
      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          {/* {renderShipping()} */}
        </div>
        <div className="flex items-center justify-between">
          {
            <form onSubmit={(e) => apply_coupon(e)}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Discount Coupon
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex items-stretch flex-grow focus-within:z-10">
                  <input
                    name="coupon_name"
                    type="text"
                    onChange={(e) => onChange(e)}
                    value={coupon_name}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-4 sm:text-sm border-gray-300"
                    placeholder="Enter Code"
                  />
                </div>
                <button
                  type="submit"
                  className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <TicketIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Apply Coupon</span>
                </button>
              </div>
            </form>
          }
        </div>
        {coupon && coupon !== null && coupon !== undefined ? (
          <div className="text-green-500">
            Coupon: {coupon.name} is applied.
          </div>
        ) : (
          <Fragment></Fragment>
        )}
        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
          <dt className="flex items-center text-sm text-gray-600">
            <span>Shipping estimate</span>
            <Link
              href="/"
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">
                Learn more about how shipping is calculated
              </span>
              <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          </dt>
          <dd className="text-sm font-medium text-gray-900">
            {shipping && shipping_id !== 0 ? (
              <>${shipping_cost}</>
            ) : (
              <div className="text-red-500">
                (Please select shipping option)
              </div>
            )}
          </dd>
        </div>
        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
          <dt className="flex text-sm text-gray-600">
            <span>Tax estimate</span>
            <Link
              href="/"
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">
                Learn more about how tax is calculated
              </span>
              <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          </dt>
          <dd className="text-sm font-medium text-gray-900">
            ${estimated_tax}
          </dd>
        </div>
        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
          <dt className="flex text-sm text-gray-600">
            <span>Subtotal</span>
          </dt>
          <dd className="text-sm font-medium text-gray-900">
            ${original_price}
          </dd>
        </div>
        {coupon && coupon !== null && coupon !== undefined ? (
          <>
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <dt className="flex text-sm text-gray-600">
                <span>Discounted Coupon</span>
              </dt>
              <dd className="text-sm font-medium text-gray-900">
                ${total_after_coupon}
              </dd>
            </div>
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <dt className="text-base font-medium text-gray-900">
                Order Total
              </dt>
              <dd className="text-base font-medium text-gray-900">
                ${total_amount}
              </dd>
            </div>
          </>
        ) : (
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
            <dt className="text-base font-medium text-gray-900">Order total</dt>
            <dd className="text-base font-medium text-gray-900">
              ${total_amount}
            </dd>
          </div>
        )}
      </dl>
      <form onSubmit={(e) => buy(e)}>
        <div className=" px-4 py-5  mt-4 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Shipping Address:
          </h3>
        </div>
        <CheckoutForm />
        {renderPaymentInfo()}
      </form>
    </section>
  );
};
export default ShippingForm;
