import { useState } from "react";
import Logo from "./Logo";
import { IoSearch } from "react-icons/io5";

import { CgLogIn } from "react-icons/cg";
import { FaUserTie } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import { MdMore } from "react-icons/md";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userState } from "@/redux/features/auth/authSlice";
import { logout } from "@/redux/features/auth/authSlice";
import { useLogoutMutation } from "@/redux/api/usersSlice";
import { toast } from "react-toastify";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleSearch = () => {};

  const dispatch = useDispatch();

  const { userInfo } = useSelector(
    (state: { auth: { userInfo: userState } }) => state.auth
  );

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      const response = await logoutApiCall({}).unwrap();
      if (response.status === 200) {
        toast.success("Sadd, Be back soon...");
        dispatch(logout());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="h-16 shadow-2xl rounded-b-xl ">
      <div className="container mx-auto  flex items-center h-full  justify-between w-[100vw] md:gap-x-8 ">
        <div className="h-full ">
          <Link to={"/"} className="w-30 flex justify-center">
            <Logo width={100} height={60} />
          </Link>
        </div>
        <div className="relative hidden md:block  ">
          <input
            type="text"
            placeholder="Search your buy..."
            className=" flex-1 hidden md:block md:min-w-96 rounded-lg py-2 placeholder:text-center border-2 border-gray-200 outline-0 pl-4 pr-10 transition-all duration-100 focus-within:shadow-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-0 top-0 bg-black h-full flex items-center justify-center w-10 rounded-2xl">
            <IoSearch
              className=""
              size={22}
              color="white"
              onClick={handleSearch}
            />
          </div>
        </div>
        <div className="px-4  h-[90%] scale-80 md:scale-90 flex bg-black/10 rounded-xl  items-center justify-center gap-x-8 ml-auto md:ml-0">
          {userInfo && (
            <TooltipProvider>
              <Tooltip>
                <Link to={"cart"} className="mt-3">
                  <TooltipTrigger className="">
                    <div className="flex relative ">
                      <FaCartShopping size={30} />
                      <span className="absolute -top-3 -right-4 bg-slate-700 rounded-full px-2 flex items-center justify-center text-white">
                        0
                      </span>
                    </div>
                  </TooltipTrigger>
                </Link>
                <TooltipContent className="bg-black text-white">
                  <p>Cart</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {userInfo && (
            <div className="relative mt-2">
              <TooltipProvider>
                <Tooltip>
                  <Link to={"profile"} className="">
                    <TooltipTrigger className="">
                      {userInfo.profilePic ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={userInfo.profilePic}
                            alt="profilePic.png"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <FaUserTie size={30} />
                      )}
                    </TooltipTrigger>
                  </Link>
                  <TooltipContent className="bg-black text-white">
                    <p>{userInfo ? userInfo.username : "Profile"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {userInfo ? (
            <TooltipProvider>
              <Tooltip>
                <div onClick={logoutHandler} className="mt-2">
                  <TooltipTrigger className="">
                    <IoMdLogOut size={30} color="red" />
                  </TooltipTrigger>
                </div>
                <TooltipContent className="bg-black text-white">
                  <p>Logout...</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <Link to={"login"} className="mt-2">
                  <TooltipTrigger className="">
                    <CgLogIn size={30} color="green" />
                  </TooltipTrigger>
                </Link>
                <TooltipContent className="bg-black text-white">
                  <p>Login...</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
