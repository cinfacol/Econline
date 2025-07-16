"use client";
import React from "react";
import { useGetOrdersQuery } from "@/redux/features/orderApiSlice";
import OrderCard from "./OrderCard";

const OrdersHistory = () => {
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

  if (isLoading) return <div className="py-8 text-center text-lg">Cargando historial de compras...</div>;
  if (isError) return <div className="py-8 text-center text-red-500">Error al cargar el historial de compras.</div>;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No tienes compras registradas.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order, idx) => (
            <OrderCard key={order.transaction_id || idx} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersHistory; 