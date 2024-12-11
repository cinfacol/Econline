import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setAuth, logOut } from "../features/auth/authSlice";

export const authMiddleware = createListenerMiddleware();

authMiddleware.startListening({
  actionCreator: setAuth,
  effect: async (action, listenerApi) => {
    // Aquí podrías guardar información adicional si es necesario
    console.log("Usuario autenticado");
  },
});

authMiddleware.startListening({
  actionCreator: logOut,
  effect: async (action, listenerApi) => {
    // Limpiar cualquier dato persistente si es necesario
    console.log("Usuario deslogueado");
  },
});
