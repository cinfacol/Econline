import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "@/redux/api/apiSlice";

const cartAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = cartAdapter.getInitialState();

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => ({
        url: "/cart/cart-items/",
      }),
      providesTags: ["Cart"],
      transformResponse: (responseData) => {
        const loadedItems = responseData?.cart_items ?? [];

        loadedItems.forEach((item, idx) => {
          if (!item.date) {
            item.date = sub(new Date(), { minutes: idx + 1 }).toISOString();
          }
        });

        // Capture backend totals and coupons
        const subtotal = responseData?.subtotal ?? 0;
        const cart_total = responseData?.cart_total ?? 0;
        const discount_amount = responseData?.discount_amount ?? 0;
        const coupons = responseData?.coupons ?? [];


        // Return normalized items along with backend totals and coupons
        return {
            ...cartAdapter.setAll(initialState, loadedItems),
            subtotal,
            cart_total,
            discount_amount,
            coupons,
        };
      },
    }),
    addItemToCart: builder.mutation({
      query: ({ inventory_id, quantity }) => ({
        url: "/cart/add-item/",
        method: "POST",
        body: { inventory_id, quantity },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response) => {
        // Verificar que response.cart existe y es un array
        const cartItems = Array.isArray(response.cart) ? response.cart : [];
        
        return {
          success: true,
          cart: cartItems,
          totalItems: response.total_items || 0,
          message: "Producto agregado al carrito exitosamente",
        };
      },
      transformErrorResponse: (error) => {
        // Manejar errores específicos del backend
        if (error?.data?.error === "Item is already in cart") {
          return {
            success: false,
            error: "El producto ya está en el carrito",
          };
        }
        
        if (error?.data?.error === "This product is out of stock") {
          return {
            success: false,
            error: "Este producto está agotado",
          };
        }
        
        if (error?.data?.error === "Inventory not found") {
          return {
            success: false,
            error: "Producto no encontrado",
          };
        }
        
        // Manejar errores de status HTTP
        if (error?.status === 409) {
          return {
            success: false,
            error: "El producto ya está en el carrito",
          };
        }
        
        return {
          success: false,
          error: error.data?.error || "Error al agregar el producto al carrito",
        };
      },
      invalidatesTags: ["Cart"],
      extraOptions: { maxRetries: 0 },
    }),
    decQty: builder.mutation({
      query: (inventoryId) => ({
        url: "/cart/decrease-quantity/",
        method: "PUT",
        body: JSON.stringify({ inventoryId }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response) => {
        return {
          success: true,
          quantity: response.quantity || 0,
          message: response.message || "Cantidad reducida",
        };
      },
      transformErrorResponse: (error) => {
        if (error?.data?.error === "Item is not in cart") {
          return {
            success: false,
            error: "El producto no está en el carrito",
          };
        }
        
        if (error?.data?.error === "Inventory ID is required") {
          return {
            success: false,
            error: "ID de inventario requerido",
          };
        }
        
        return {
          success: false,
          error: error.data?.error || "Error al reducir la cantidad",
        };
      },
      invalidatesTags: ["Cart"],
      extraOptions: { maxRetries: 0 },
    }),
    incQty: builder.mutation({
      query: (inventoryId) => ({
        url: "/cart/increase-quantity/",
        method: "PUT",
        body: JSON.stringify({ inventoryId }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response) => {
        return {
          success: true,
          quantity: response.quantity || 0,
          message: "Cantidad incrementada",
        };
      },
      transformErrorResponse: (error) => {
        
        if (error?.data?.error === "Item is not in cart") {
          return {
            success: false,
            error: "El producto no está en el carrito",
          };
        }
        
        if (error?.data?.error === "Inventory ID is required") {
          return {
            success: false,
            error: "ID de inventario requerido",
          };
        }
        
        if (error?.data?.error === "Not enough stock available") {
          return {
            success: false,
            error: "No hay suficiente stock disponible",
          };
        }
        
        return {
          success: false,
          error: error.data?.error || "Error al incrementar la cantidad",
        };
      },
      invalidatesTags: ["Cart"],
      extraOptions: { maxRetries: 0 },
    }),
    removeItem: builder.mutation({
      query: ({ itemId }) => ({
        url: "/cart/remove-item/",
        method: "POST",
        body: { inventory_id: itemId },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response) => {
        // Verificar que response.cart existe y es un array
        const cartItems = Array.isArray(response.cart) ? response.cart : [];
        
        return {
          success: true,
          cart: cartItems,
          totalItems: response.total_items || 0,
          // Extraer datos según la estructura del serializer solo si cartItems es un array
          items: cartItems.length > 0 ? cartItems.map((item) => ({
            id: item.id,
            cart: item.cart,
            inventory: item.inventory,
            quantity: item.quantity,
            coupon: item.coupon,
          })) : [],
        };
      },
      transformErrorResponse: (error) => ({
        success: false,
        error: error.data?.error || "Error al eliminar el producto",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "/cart/clear/",
        method: "POST",
      }),

      transformResponse: (response, meta, arg) => response,

      // Transformar respuesta para manejar errores
      transformErrorResponse: (response) => response,
      invalidatesTags: ["Cart", "CartItems"],

      extraOptions: {
        maxRetries: 0,
      },
    }),
  }),
});

export const {
  useGetItemsQuery,
  useAddItemToCartMutation,
  useDecQtyMutation,
  useIncQtyMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} = cartApiSlice;
