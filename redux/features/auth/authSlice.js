import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiSlice } from "@/redux/api/apiSlice";

// Async thunk para verificar el token
export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      // Usar la misma configuración de base URL que apiSlice
      const baseUrl = process.env.NEXT_PUBLIC_HOST || "http://localhost:9090";
      const url = `${baseUrl}/api/auth/jwt/verify/`;
      
      const response = await fetch(url, {
        method: "POST",
        credentials: "include", // Para incluir las cookies
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // El backend retorna is_guest (con guión bajo)
        if (data.is_guest) {
          return { isGuest: true };
        } else {
          return { isAuthenticated: true };
        }
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue({ error: "Network error" });
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
    setAuth: (state) => {
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
        if (action.payload.isGuest) {
          state.isGuest = true;
          state.isAuthenticated = false;
        } else {
          state.isAuthenticated = true;
          state.isGuest = false;
        }
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isGuest = false;
      });
  },
});

export const { setAuth, setGuest, logout, finishInitialLoad } = authSlice.actions;
export default authSlice.reducer;
