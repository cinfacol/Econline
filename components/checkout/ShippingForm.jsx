"use client";

import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { TicketIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import AddressDefault from "@/components/user/Addressdefault";
import { Currency } from "@/components/ui";
import { useGetPaymentTotalQuery } from "@/redux/features/payment/paymentApiSlice";
import { useCalculateShippingMutation } from "@/redux/features/cart/cartApiSlice";
import { toast } from "sonner";
import React from "react";

const ShippingForm = ({
  onChange,
  shippingOptions,
  shipping_cost,
  onShippingChange,
  renderPaymentInfo,
  onPaymentSubmit,
  apply_coupon,
  coupon,
  coupon_name,
  total_after_coupon,
}) => {
  const { data } = useGetPaymentTotalQuery();
  const [calculateShipping, { isLoading: isCalculatingShipping }] = useCalculateShippingMutation();
  const [shippingError, setShippingError] = useState(null);
  const [isShippingCalculated, setIsShippingCalculated] = useState(false);
  const sub_total = data?.subtotal || 0;

  // Convertir la estructura normalizada a un array para el renderizado
  const shippingOptionsArray = React.useMemo(() => {
    if (!shippingOptions) {
      return [];
    }
    
    if (Array.isArray(shippingOptions)) {
      return shippingOptions;
    }
    
    if (shippingOptions.ids && shippingOptions.entities) {
      return shippingOptions.ids
        .map(id => shippingOptions.entities[id])
        .filter(Boolean);
    }
    
    return [];
  }, [shippingOptions]);

  // Calcular envío automáticamente cuando cambia el total
  useEffect(() => {
    if (sub_total > 0 && shippingOptionsArray.length > 0) {
      setShippingError(null);
      // Usar la primera opción de envío disponible
      const defaultShippingOption = shippingOptionsArray[0];
      
      calculateShipping({
        shipping_id: defaultShippingOption.id,
        order_total: sub_total,
      })
        .unwrap()
        .then((response) => {
          const newShippingCost = response.is_free_shipping ? 0 : response.shipping_cost;
          // Solo mostrar el toast si el envío es gratis y el costo actual no es 0
          if (response.is_free_shipping && shipping_cost !== 0) {
            toast.success("¡Felicidades! Tu pedido califica para envío gratuito");
          }
          onShippingChange({ target: { value: defaultShippingOption.id } }, newShippingCost);
          setIsShippingCalculated(true);
        })
        .catch((error) => {
          console.error("Error al calcular envío:", error);
          setShippingError(error.data?.detail || "Error al calcular el envío");
          // Si hay error, usar el costo estándar
          onShippingChange({ target: { value: defaultShippingOption.id } }, defaultShippingOption.standard_shipping_cost);
          setIsShippingCalculated(true);
        });
    }
  }, [sub_total, shippingOptionsArray]);

  // Renderizado de información de envío
  const renderShippingInfo = () => {
    if (!shippingOptionsArray.length) {
      return (
        <div className="text-gray-500">
          No hay opciones de envío disponibles
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-400 mt-1">
              (Debug: No hay opciones de envío disponibles)
            </div>
          )}
        </div>
      );
    }

    const selectedOption = shippingOptionsArray[0];
    const isFreeShipping = shipping_cost === 0;

    return (
      <div className="mb-5">
        <div className="flex justify-between items-center">
          <div>
            <span className="block text-sm font-medium text-gray-900">
              {selectedOption.name}
            </span>
            <span className="block text-sm text-gray-500">
              {selectedOption.time_to_delivery}
            </span>
          </div>
          <div className="text-right">
            {isFreeShipping ? (
              <span className="text-green-600 font-medium">Gratis</span>
            ) : (
              <Currency value={shipping_cost} />
            )}
          </div>
        </div>
        {selectedOption.free_shipping_threshold > 0 && !isFreeShipping && (
          <div className="mt-2 text-sm text-green-600">
            Envío gratis en pedidos mayores a{" "}
            <Currency value={selectedOption.free_shipping_threshold} />
          </div>
        )}
        {shippingError && (
          <div className="text-sm text-red-500 mt-2">
            {shippingError}
          </div>
        )}
      </div>
    );
  };

  const total_to_pay = parseFloat(sub_total || 0) + parseFloat(shipping_cost || 0);

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
          {renderShippingInfo()}
        </div>
        <div className="flex items-center justify-between">
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
        </div>
        {coupon !== null && coupon !== undefined ? (
          <div className="text-green-500">
            Coupon: {coupon.name} is applied.
          </div>
        ) : (
          <Fragment></Fragment>
        )}

        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
          <dt className="flex text-sm text-gray-600">
            <span>Subtotal</span>
          </dt>
          <dd className="text-sm font-medium text-gray-900">
            <Currency value={sub_total} />
          </dd>
        </div>
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
            {shipping_cost === 0 ? (
              <span className="text-green-600">Gratis</span>
            ) : (
              <Currency value={shipping_cost} />
            )}
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
                <Currency value={total_after_coupon} />
              </dd>
            </div>
          </>
        ) : (
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
            <dt className="text-base font-medium text-gray-900">Order total</dt>
            <dd className="text-base font-medium text-gray-900">
              <Currency value={total_to_pay} />
            </dd>
          </div>
        )}
      </dl>
      <div className="mt-6">
        <AddressDefault />
      </div>

      <div className="mt-6">
        <form onSubmit={onPaymentSubmit}>
          {typeof renderPaymentInfo === 'function' 
            ? renderPaymentInfo({ 
                isShippingCalculated, 
                isCalculatingShipping 
              }) 
            : renderPaymentInfo}
        </form>
      </div>
    </section>
  );
};

export default ShippingForm;
