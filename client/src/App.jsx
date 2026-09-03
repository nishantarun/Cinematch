import { Outlet } from "react-router-dom";
import useSocket from "./hooks/useSocket.js";
import { useEffect } from "react";
import useThemeStore from "./store/themeStore.js";

const App = () => {
  useSocket();

  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return <Outlet />;
};

export default App;
