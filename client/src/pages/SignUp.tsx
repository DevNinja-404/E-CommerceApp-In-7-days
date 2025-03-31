import Input from "@/components/Input";
import React, {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEye } from "react-icons/fa6";
import { IoIosEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import User from "../assets/signin.gif";
import { FaFileUpload } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Id, toast } from "react-toastify";
import { useLoginMutation, useRegisterMutation } from "@/redux/api/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, userState } from "@/redux/features/auth/authSlice";

interface formData {
  username: string;
  email: string;
  password: string;
  profilePic: File | null;
  confirmPassword: string;
}
const SignUp = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [hovered, setHovered] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const profilePicRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<formData>();

  //   See we have made our input for profilePic so how do we click it?This is how,we take the reference of that input and when we click on that div we call handleProfilePicInputCLick which executs onCLick event on our input element
  const handleProfilePicInputClick: MouseEventHandler = (
    e: React.MouseEvent
  ) => {
    profilePicRef.current?.click();
    e.preventDefault();
  };

  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
      console.log(URL.createObjectURL(file));
      setValue("profilePic", file);
    }
  };

  const handleProfilePicRemove = (e: React.MouseEvent) => {
    setPreview(null);
    setValue("profilePic", null);
    e.preventDefault();
    if (profilePicRef.current) {
      profilePicRef.current.value = ""; // Reset the file input so it can detect new changes
    }
  };

  const [registerApiCall] = useRegisterMutation();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(
    (state: { auth: { userInfo: userState } }) => state.auth
  );

  const toastId = React.useRef<null | Id>(null);
  const registerSuccessToast = () =>
    (toastId.current = toast.loading(
      "Registered successfully,Logging you in..."
    ));

  const dismissRegisterSuccessToast = () =>
    toast.dismiss(toastId.current as Id);

  const handleSignUp: SubmitHandler<formData> = async (data: formData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Password must be confirmed...");
      return;
    }
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.profilePic?.name) formData.append("profilePic", data.profilePic);
    try {
      const response = await registerApiCall(formData).unwrap();
      if (response.status === 200) {
        registerSuccessToast();
        const loginResponse = await login({
          email: data.email,
          password: data.password,
        }).unwrap();
        setTimeout(async () => {
          if (loginResponse.status === 200) {
            dismissRegisterSuccessToast();
            toast.success(`Welcome , ${loginResponse.data.username}`);
            dispatch(setCredentials(loginResponse.data));
            navigate("/");
          }
        }, 1000);
      }
    } catch (error) {
      toast.error(error.data.message || "An unknown error occurred");
    }
  };

  useEffect(() => {
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

  return (
    <div className="absolute  inset-0 bg-black/50 flex items-center justify-center">
      <form
        className="flex flex-col w-[90%] md:w-1/2 xl:w-1/3 bg-white p-6 rounded-sm items-center justify-center "
        onSubmit={handleSubmit(handleSignUp)}
      >
        <h1 className="text-2xl font-semibold">SignUp😎</h1>
        <div className="w-20 h-20 relative rounded-full  overflow-hidden flex items-center justify-center mt-8 ">
          <img
            src={preview ? preview : User}
            alt=""
            className="object-cover w-[100%] h-[100%] "
          />

          <div
            role="button"
            onMouseDown={(e) => e.preventDefault()}
            className="absolute inset-0 hover:bg-black/50  flex rounded-full  items-center justify-center"
            onClick={
              preview ? handleProfilePicRemove : handleProfilePicInputClick
            }
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {hovered && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {preview ? (
                        <MdDeleteForever size={30} color="red" />
                      ) : (
                        <FaFileUpload size={30} />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {preview
                          ? "Remove Profile Pic"
                          : "Upload Profile Picture"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
          <input
            type="file"
            ref={profilePicRef}
            accept=".png, .jpg, .jpeg, .svg ,.webp"
            name="profilePic"
            onChange={handleProfilePicChange}
            className="hidden"
          />
        </div>
        <div className="w-full flex flex-col gap-y-2 mt-7">
          <Input
            className=""
            label="Name :"
            type="text"
            placeholder="Enter name..."
            {...register("username", { required: "Name is required" })}
          />
          {errors.username && (
            <p className="text-red-700 ml-3">{errors.username.message}...</p>
          )}
        </div>
        <div className="w-full flex flex-col gap-y-2 mt-5">
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
            className="absolute bottom-7 right-10 cursor-pointer "
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
        <div className="relative w-full flex flex-col gap-y-2 mt-5">
          <Input
            className=""
            label="ConfirmPassword :"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password..."
            {...register("confirmPassword", {
              required: "Password must be confirmed...",
            })}
          />
          <span
            className="absolute bottom-7 right-10 cursor-pointer "
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <IoIosEyeOff className="" size={25} color="white" />
            ) : (
              <FaEye className="" size={25} color="white" />
            )}
          </span>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-700 ml-3 text-start  w-full">
            {errors.confirmPassword.message}...
          </p>
        )}
        <button
          type="submit"
          className="bg-black px-6 py-2 text-white rounded-md mt-8"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signning In..." : "SignUp"}
        </button>
        <p className="mt-8">
          Already Have An Account?
          <Link to="/login">
            <span className="hover:underline"> LogIn</span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
