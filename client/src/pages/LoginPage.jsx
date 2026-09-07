import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authApi.js";
import userAuthStore from "../store/authStore.js";

import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Card from "../components/ui/Card.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await loginUser(formData);

      userAuthStore.getState().login(response.token);

      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error.response?.data);
    }
  };

  return (
    <main className="min-h-screen bg-background text-text">
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">CineMatch</h1>

        <ThemeToggle />
      </header>

      <section className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
        <Card>
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">Login</h2>

              <p className="mt-2 text-sm text-text-muted">
                Sign in to continue your movie session.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>

                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <Input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>

              <Button type="submit">Login</Button>
            </form>

            <p className="mt-6 text-center text-sm text-text-muted">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:text-primary-hover"
              >
                Register
              </Link>
            </p>
          </div>
        </Card>
      </section>
    </main>
  );
};

export default LoginPage;
