import Input from "@/components/Input";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { FaEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";

interface formData {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<formData>();

  const handleLogin: SubmitHandler<formData> = (data) => {
    console.log(data);
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="absolute  inset-0 bg-black/50 flex items-center justify-center">
      <form
        className="flex flex-col w-[90%] md:w-1/2 xl:w-1/3 bg-white p-6 rounded-sm items-center justify-center "
        onSubmit={handleSubmit(handleLogin)}
      >
        <h1 className="text-2xl font-semibold">Login👋</h1>
        <div className="w-full flex flex-col gap-y-2 mt-7">
          <Input
            label="Email :"
            type="email"
            placeholder="Enter email..."
            {...register("email", { required: "Email is required" })}
            //   register("email") returns an object containing name, onChange, onBlur, ref, and other properties.
            // The spread operator (...register(...)) passes these properties as props into Input.
          />
          {errors.email && (
            <p className="text-red-700 ml-3">{errors.email.message}...</p>
          )}
        </div>
        <div className="relative w-full flex flex-col gap-y-2 mt-5">
          <Input
            label="Password :"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password..."
            {...register("password", { required: "Password is required" })}
          />
          <span
            className="absolute bottom-7 right-10"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <IoIosEyeOff className="" size={25} color="white" />
            ) : (
              <FaEye className="" size={25} color="white" />
            )}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-700 ml-3 text-start  w-full">
            {errors.password.message}...
          </p>
        )}
        <div className=" w-full text-end mt-1 ">
          <Link to="/forgot-password">
            <span className="hover:underline  hover:text-blue-600 ">
              Forgot Password?
            </span>
          </Link>
        </div>
        <button
          type="submit"
          className="bg-black px-6 py-2 text-white rounded-md mt-8"
        >
          {isSubmitting ? "Logging In..." : "Login"}
        </button>
        <p className="mt-8">
          Don't Have An Account?
          <Link to="/sign-up">
            <span className="hover:underline"> SignUp</span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
