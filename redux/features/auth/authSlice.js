import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk para verificar el token silenciosamente (sin endpoints que requieren auth)
export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_HOST || "http://localhost:9090";
      const url = `${baseUrl}/api/auth/jwt/verify/`;

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Si la verificación es exitosa, el usuario está autenticado
        if (data.is_guest) {
          return { isGuest: true, isAuthenticated: false };
        } else {
          return { isGuest: false, isAuthenticated: true };
        }
      } else {
        // Si falla la verificación, el usuario es guest
        return { isGuest: true, isAuthenticated: false };
      }
    } catch (error) {
      // En caso de error de red, asumir guest
      return { isGuest: true, isAuthenticated: false };
    }
  }
);

const initialState = {
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      state.isGuest = false;
    },
    setGuest: (state) => {
      state.isAuthenticated = false;
      state.isGuest = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isGuest = false;
    },
    finishInitialLoad: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.isGuest = action.payload.isGuest;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isGuest = true;
      });
  },
});

export const { setAuth, setGuest, logout, finishInitialLoad } =
  authSlice.actions;
export default authSlice.reducer;
