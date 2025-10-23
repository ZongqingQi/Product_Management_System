/**
 * Main Entry Point
 * Wraps the entire app with Redux Provider to enable global state management
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Redux Provider wraps the entire app */}
    {/* This makes the Redux store available to all components via useSelector and useDispatch hooks */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);