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
        <Route element={<App />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<Protection />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/room/:roomCode" element={<RoomPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
