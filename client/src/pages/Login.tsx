import Input from "@/components/Input";
import { useLoginMutation } from "@/redux/api/usersSlice";
import { setCredentials, userState } from "@/redux/features/auth/authSlice";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { FaEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();

  const { userInfo } = useSelector(
    (state: { auth: { userInfo: userState } }) => state.auth
  );

  // SO what this does is:
  // useLocation gets the current url and sp stores the params of that url.
  // redirecct stores that param which is named as redirect
  // so for eg. if we try to access profile without logging in first then we will directed to login page with the redirect param in the url as /product so once we login we will be redirected to product page which we had tried accessing before logging in.
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    // This is because since we r uisng redirect hadn't it been checked whether it startsWith "/" then we can basically inject any url in the /login?redirect="https://myPhisingWebsite.com" and would have risked security so we check this so that we cannot go to any external url.
    if (!redirect.startsWith("/")) {
      navigate("/"); // Prevents external redirects
    }
    if (userInfo) navigate(redirect);
  }, [userInfo, navigate, redirect]);

  const handleLogin: SubmitHandler<formData> = async (data) => {
    try {
      const response = await login(data).unwrap();
      console.log(response);

      if (response.status === 200) {
        dispatch(setCredentials(response.data));
        toast.success(`Good to see u back , ${response.data.username}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "An unknown error occurred");
    }
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
            className=""
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
            className=""
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
