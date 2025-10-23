/**
 * Redux Store Configuration
 * Creates the centralized state store for the application
 *
 * Flow:
 * 1. Import cartReducer from cartSlice.js (defines how cart state changes)
 * 2. Configure store with cart reducer under 'cart' key
 * 3. Export store to be used in main.jsx with Provider component
 *
 * Usage in components:
 * - useSelector((state) => state.cart) - Read cart state
 * - useDispatch() - Dispatch actions to modify cart state
 */

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    // 'cart' key makes cart state accessible via state.cart
    // cartReducer handles all cart-related actions (addToCart, updateQuantity, etc.)
    cart: cartReducer,
  },
});