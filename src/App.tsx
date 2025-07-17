import { RouterProvider } from "react-router";
import "./App.css";
import { routes } from "./router/router";
import ContextProvider from "./context/Context";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <ContextProvider>
      <RouterProvider router={routes} />
      <ToastContainer />
    </ContextProvider>
  );
}

export default App;
