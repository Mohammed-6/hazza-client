import Link from "next/link";
import { AuthContext } from "../context/authContext";
import { ReactNode, useContext, useEffect, useState } from "react";
import { ChatContext, ChatContextProvider } from "@/context/chatContext";
import {
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { messageType } from "./types/chat";
import moment from "moment";
import { useRouter } from "next/router";

const LayoutView = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("user")) {
        router.push("/login");
      }
    }
  }, []);
  return (
    <>
      <Layout />
      {children}
    </>
  );
};

const Layout = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  // console.log(user);
  const { shownotification, toogleNotification, unreadmessage } =
    useContext(ChatContext);

  const userLogout = () => {
    localStorage.removeItem("user");
  };
  return (
    <>
      <div className="bg-slate-900 px-[10%] py-0">
        <div className="flex justify-between items-center">
          <div className="">
            <Link
              href={"/"}
              className="text-white text-2xl no-underline cursor-pointer"
            >
              Hazza - ChattApp
            </Link>
          </div>
          {user && (
            <>
              <div className="text-yellow-600 text-sm">
                Logged in as {user?.name}
              </div>
            </>
          )}
          <div className="">
            <div className="flex items-center text-white gap-x-4">
              {user && (
                <>
                  <div className="h-auto hover:bg-white/50 hover:cursor-pointer duration-150 py-2 relative">
                    <ChatBubbleLeftRightIcon
                      className="w-6 stroke-white mx-2"
                      onClick={toogleNotification}
                    />
                    <div className="absolute top-1 right-0">
                      <div className="w-4 h-4 rounded-full border0 bg-blue-600 text-white flex justify-center items-center text-[8px]">
                        {unreadmessage.length}
                      </div>
                    </div>
                  </div>
                  <Link onClick={userLogout} href={"/login"}>
                    Logout
                  </Link>
                </>
              )}
              {shownotification ? <Notification /> : ""}
              {!user && (
                <>
                  <Link href={"/login"}>Login</Link>
                  <Link href={"/register"}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Notification = () => {
  const { user } = useContext(AuthContext);
  const { unreadmessage, chatusers, shownotification, toogleNotification } =
    useContext(ChatContext);
  return (
    <>
      <ChatContextProvider user={user}>
        <>
          <div className="absolute inset-0 bg-black/50 delay-200">
            <div className="">
              <div
                className={`w-4/12 bg-gray-50 h-screen overflow-y-auto p-8 absolute right-0 transition-all ease-in-out duration-150 ${
                  shownotification ? "translate-x-[0%]" : "translate-x-[100%]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="focus:outline-none text-2xl font-semibold leading-6 text-gray-800">
                    Notifications
                  </div>
                  <div>
                    <XMarkIcon
                      className="w-6 stroke-black cursor-pointer"
                      onClick={toogleNotification}
                    />{" "}
                  </div>
                </div>
                {unreadmessage &&
                  unreadmessage.map((msg: messageType) => {
                    let name = "User";
                    const findU = chatusers.find((chat: any) =>
                      chat.members.some((u: any) => u._id === msg.senderId)
                    );
                    if (findU) {
                      const tt = findU.members.filter(
                        (u: any) => u._id === msg.senderId
                      );
                      console.log(tt);
                      if (tt.length > 0) {
                        name = tt[0].name;
                      }
                    }
                    console.log(findU);
                    return (
                      <>
                        <div className="w-full p-3 mt-6 bg-white rounded flex shadow-sm">
                          <div className="focus:outline-none w-8 h-8 border rounded-full border-gray-200 flex items-center justify-center">
                            <ChatBubbleOvalLeftIcon className="w-6 stroke-green-500" />
                          </div>
                          <div className="pl-3">
                            <p className="focus:outline-none text-sm leading-none text-gray-700">
                              <span className="text-blue-500">{name}</span>{" "}
                              Message: <span className="">{msg.text}</span>
                            </p>
                            <p className="focus:outline-none text-xs leading-3 pt-1 text-gray-500 clear-both">
                              {moment(msg.createdAt).calendar()}
                            </p>
                          </div>
                        </div>
                      </>
                    );
                  })}
                {unreadmessage.length === 0 && (
                  <div className="flex items-center justiyf-between">
                    <hr className="w-full" />
                    <p className="focus:outline-none text-sm flex flex-shrink-0 leading-normal px-3 py-16 text-gray-500">
                      No notifications
                    </p>
                    <hr className="w-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      </ChatContextProvider>
    </>
  );
};

export default LayoutView;
