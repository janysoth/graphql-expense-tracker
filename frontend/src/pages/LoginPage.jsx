import { Link } from "react-router-dom";
import { useState } from "react";
import InputField from "../components/InputField";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations/user.mutation";
import toast from "react-hot-toast";
import Greeting from "../components/ui/Greeting";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [login, { loading }] = useMutation(LOGIN, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) return toast.error("Please fill in all fields");
    try {
      await login({ variables: { input: loginData } });
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 sm:p-8">
      <Greeting />
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-black text-center">
          Login
        </h1>
        <h2 className="text-sm sm:text-base font-semibold mb-6 text-gray-500 text-center">
          Welcome back! Log in to your account
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            label="Username"
            id="username"
            name="username"
            value={loginData.username}
            onChange={handleChange}
            disabled={loading}
          />
          <InputField
            label="Password"
            id="password"
            name="password"
            type="password"
            value={loginData.password}
            onChange={handleChange}
            disabled={loading}
          />
          <div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
        <div className="mt-4 text-sm sm:text-base text-gray-600 text-center">
          <p>
            {"Don't"} have an account?{" "}
            <Link to="/signup" className="text-black hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;