import routes from "./router/routes";
import { RouterProvider } from "react-router-dom";
import "./App.css";

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
