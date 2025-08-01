import OrdersHistory from "@/components/orders/OrdersHistory";

export const metadata = {
  title: "Mis Compras",
  description: "Purchase Page in a Modern Ecommerce App",
};

function Compras() {
  return (
    <div>
      <h1>Tus Compras</h1>
      <OrdersHistory />
    </div>
  );
}

export default Compras;
