import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "../App.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import RoomPage from "../pages/RoomPage.jsx";
import Protection from "./Protection.jsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route element={<Protection />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/room/:roomCode" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
