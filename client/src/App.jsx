import { Outlet } from "react-router-dom";
import useSocket from "./hooks/useSocket.js";

const App = () => {
  useSocket();

  return <Outlet />;
};

export default App;
