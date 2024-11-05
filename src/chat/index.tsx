import {
  ArrowDownIcon,
  ArrowPathRoundedSquareIcon,
  ArrowUpIcon,
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleLeftIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChatBubbleOvalLeftIcon,
  CheckIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  Squares2X2Icon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import LayoutView from "../layout";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext, ChatContextProvider } from "@/context/chatContext";
import { isTypingType, messageType, userlistType } from "../types/chat";
import { AuthContext } from "@/context/authContext";
import moment from "moment";
import { format, isSameDay } from "date-fns";
import { formDataType, formType, listFormType } from "../types/form";
import { baseUrl, getRequest, objectToTable } from "@/utils/services";
import Link from "next/link";

const Main = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div className="h-screen">
        {user && (
          <ChatContextProvider user={user}>
            <Content />
          </ChatContextProvider>
        )}
      </div>
    </>
  );
};

const Content = () => {
  const { currentchat } = useContext(ChatContext);
  return (
    <>
      <LayoutView>
        <div className="grid grid-cols-12">
          <div className="col-span-2">
            <Menu />
          </div>
          <div className="col-span-4">
            <Messages />
          </div>
          <div className="col-span-6">{currentchat && <Conversation />}</div>
        </div>
      </LayoutView>
    </>
  );
};

export const Menu = () => {
  return (
    <>
      <div className="">
        <div className="border border-gray-200 px-6 py-8">
          <div className="flex items-center">
            <div>
              <ChatBubbleOvalLeftEllipsisIcon className="w-10 fill-blue-500 stroke-white" />
            </div>
            <div className="font-bold text-2xl">Chatbox</div>
          </div>
        </div>
        <div className="py-5 border-r border-gray-200 min-h-auto">
          <div className="flex mx-6 py-2 rounded-md px-2 my-2 gap-x-5 items-center">
            <div>
              <Squares2X2Icon className="w-6 stroke-gray-400" />
            </div>
            <div>Dashboard</div>
          </div>
          <Link
            href={"/chat"}
            className="flex mx-6 py-2 rounded-lg px-2 my-2 gap-x-5 items-center bg-blue-500 text-white"
          >
            <div>
              <ChatBubbleLeftEllipsisIcon className="w-6 stroke-white" />
            </div>
            <div>Chat</div>
          </Link>
          <Link
            href={"/form"}
            className="flex mx-6 py-2 rounded-lg px-2 my-2 gap-x-5 items-center bg-white text-gray-600"
          >
            <div>
              <FolderIcon className="w-6 stroke-gray-600" />
            </div>
            <div>Form</div>
          </Link>
          <Link
            href={"/trigger"}
            className="flex mx-6 py-2 rounded-lg px-2 my-2 gap-x-5 items-center bg-white text-gray-600"
          >
            <div>
              <ArrowPathRoundedSquareIcon className="w-6 stroke-gray-600" />
            </div>
            <div>Trigger</div>
          </Link>
        </div>
      </div>
    </>
  );
};

const Messages = () => {
  const { showusers, toogleUsers } = useContext(ChatContext);

  return (
    <>
      <div className="">
        <div className="border border-gray-200 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="font-bold text-2xl text-blue-500">Messages</div>
            <div className="">
              {showusers ? (
                <ChatBubbleLeftIcon
                  className="w-10 stroke-gray-400 p-2 bg-gray-200 rounded-full"
                  onClick={toogleUsers}
                />
              ) : (
                <MagnifyingGlassIcon
                  className="w-10 stroke-gray-400 p-2 bg-gray-200 rounded-full"
                  onClick={toogleUsers}
                />
              )}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="">
            {showusers ? <ShowAllUsers /> : <ShowExistingUsers />}
          </div>
        </div>
      </div>
    </>
  );
};

const ShowAllUsers = () => {
  const { allusers, isallusersloading, createChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  const [users, setusers] = useState<any>([]);

  useEffect(() => {
    setusers(allusers);
  }, [allusers]);

  const formChange = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    const results = allusers.filter((u: any) =>
      u.name.toLowerCase().includes(evt.value)
    );
    setusers(results);
  };
  return (
    <>
      <div className="flex">
        <input
          type="text"
          className="form-input"
          placeholder="Search..."
          onKeyUp={formChange}
          onChange={formChange}
        />
      </div>
      <div className="flex gap-x-2 items-center pt-4 pb-2">
        <div>
          <UsersIcon className="w-4 stroke-gray-400" />
        </div>
        <div className="text-sm text-gray-400">All Users</div>
      </div>
      <div className="">
        {isallusersloading && <div className="">Loading...</div>}
        {users &&
          users.map((u: userlistType, k: number) => {
            return (
              <div
                className="flex items-center gap-x-4 py-3 hover:cursor-pointer"
                key={k}
                onClick={() =>
                  createChat({
                    userId: u?._id,
                    senderId: user?._id,
                    senderName: u.name,
                  })
                }
              >
                <div className="">
                  <img
                    src="https://cdn-icons-png.freepik.com/512/8742/8742495.png"
                    className="w-14 rounded-full"
                  />
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between ">
                    <div className="font-bold">{u.name}</div>
                    <div className="text-sm text-gray-400"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div></div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

const ShowExistingUsers = () => {
  const {
    chatusers,
    makeCurrentChat,
    ischatloading,
    istyping,
    unreadmessage,
    allmessage,
    currentchat,
    onlineUsers,
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  return (
    <>
      <div className="flex gap-x-2 items-center pt-4 pb-2">
        <div>
          <ChatBubbleLeftIcon className="w-4 stroke-gray-400" />
        </div>
        <div className="text-sm text-gray-400">All Message</div>
      </div>
      <div className="">
        {ischatloading && <div className="">Loading...</div>}
        {chatusers &&
          chatusers.map((chat: userlistType, k: number) => {
            let last: any = "";
            const fil: any = chat.members?.filter((m) => m._id !== user._id);
            const name = fil[0]?.name;
            if (chat.lastMessage) {
              const temp = chat.lastMessage;
              last = temp;
              if (
                last.isForm === true &&
                last.isFormSubmitted === true &&
                last.senderId !== user._id
              ) {
                last.text = "Form submitted!";
              } else if (
                last.isForm === true &&
                last.isFormSubmitted === true &&
                last.senderId === user._id
              ) {
                last.text = "Form received!";
              }
            }
            if (allmessage.length > 0 && currentchat?.chatId === chat._id) {
              const temp = allmessage[allmessage.length - 1];
              last = { ...temp };
              if (
                last.isForm === true &&
                last.isFormSubmitted === true &&
                last.senderId !== user._id
              ) {
                last.text = "Form submitted!";
              } else if (
                last.isForm === true &&
                last.isFormSubmitted === true &&
                last.senderId === user._id
              ) {
                last.text = "Form received!";
              }
            }
            // console.log(last);
            const unreadFilter = unreadmessage.filter(
              (un: messageType) => un.chatId === chat._id
            );
            const temo = unreadFilter[unreadFilter.length - 1];
            if (temo) {
              last = temo;
            }
            const findIstyping = istyping.findIndex(
              (t: any) => t.userId === fil[0]?._id
            );
            // console.log(onlineUsers);
            const online =
              onlineUsers.length > 0 &&
              onlineUsers.findIndex((u: any) => u.userId === fil[0]?._id);
            // console.log(online);
            return (
              <div
                className="flex items-center gap-x-4 py-3 hover:cursor-pointer"
                key={k}
                onClick={() =>
                  makeCurrentChat({
                    userId: fil[0]?._id,
                    senderId: user?._id,
                    senderName: name,
                    chatId: chat._id,
                  })
                }
              >
                <div className="">
                  <img
                    src="https://cdn-icons-png.freepik.com/512/8742/8742495.png"
                    className={`w-14 rounded-full ${
                      online !== -1 && "ring-2 ring-green-500"
                    }`}
                  />
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between ">
                    <div className="font-bold">{name}</div>
                    <div className="text-sm text-gray-400">
                      {last && moment(last?.createdAt).calendar()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="">
                      {findIstyping !== -1 ? (
                        istyping.map((t: isTypingType, k: number) =>
                          t?.type === true && t?.userId === fil[0]?._id ? (
                            <>
                              <div className="text-sm text-green-400" key={k}>
                                {name}
                                {" typing....."}
                              </div>
                            </>
                          ) : (
                            t?.type === false &&
                            t?.userId === fil[0]?._id && (
                              <div className="text-sm">
                                {last && last?.senderId === user?._id
                                  ? fil[0]?.name + ": "
                                  : last && "You: "}
                                {last && last?.text}
                              </div>
                            )
                          )
                        )
                      ) : findIstyping === -1 ? (
                        <div className="text-sm">
                          {last && last?.senderId === user?._id
                            ? fil[0]?.name + ": "
                            : last && "You: "}
                          {last && last?.text}
                        </div>
                      ) : (
                        ""
                      )}
                      {/* {!istyping && last && } */}
                    </div>
                    <div>
                      {unreadFilter.length > 0 && (
                        <div className="w-6 h-6 rounded-full border0 bg-blue-600 text-white flex justify-center items-center text-xs">
                          {unreadFilter.length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

const Conversation = () => {
  const { user } = useContext(AuthContext);
  const {
    currentchat,
    istyping,
    showdownloadform,
    showuploadform,
    toogleUDForm,
  } = useContext(ChatContext);
  // console.log(currentchat);

  return (
    <>
      <div className="border border-gray-200 px-6 py-4">
        <div className="flex items-center gap-x-4 py-3">
          <div className="">
            <img
              src="https://seeklogo.com/images/O/orange-logo-FEF8413207-seeklogo.com.png"
              className="w-14 h-12 object-contain"
            />
          </div>
          <div className="w-full">
            <div className="font-bold text-xl">{currentchat?.senderName}</div>
            {istyping &&
              istyping.map(
                (t: isTypingType) =>
                  t.userId === currentchat.userId &&
                  t?.type &&
                  t?.userId === currentchat.userId && (
                    <>
                      <div className="text-sm text-green-400">
                        {currentchat.senderName}{" "}
                        {t?.type && t?.userId === currentchat.userId
                          ? "typing....."
                          : ""}
                      </div>
                    </>
                  )
              )}
          </div>
          <div className="flex items-center gap-x-3 relative">
            <ArrowDownIcon
              className="w-10 stroke-gray-300 cursor-pointer"
              onClick={() => toogleUDForm({ type: "download" })}
            />
            {showdownloadform && <DownloadContainer />}
            {showuploadform && <UploadContainer />}
            <ArrowUpIcon
              className="w-10 stroke-gray-300 cursor-pointer"
              onClick={() => toogleUDForm({ type: "upload" })}
            />
            <img
              src="https://cdn-icons-png.freepik.com/512/8742/8742495.png"
              className={`h-10 w-12 ring-1 ring-gray-200 rounded-full `}
            />
          </div>
        </div>
      </div>
      <MessageWithSend />
    </>
  );
};

const MessageWithSend = () => {
  const { user } = useContext(AuthContext);
  const {
    currentchat,
    typeMessage,
    sendMessage,
    allmessage,
    message,
    typingStop,
  } = useContext(ChatContext);
  // console.log(currentchat);

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<number | undefined>();

  const changeMessage = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const evt = e.target as HTMLTextAreaElement;
    // console.log(currentchat);
    typeMessage({
      userId: currentchat?.userId,
      senderId: currentchat?.senderId,
      chatId: currentchat?.chatId,
      message: evt.value,
    });

    setIsTyping(true); // Typing has started

    // Clear the existing timeout if user types again before timeout completes
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to detect typing has stopped (2 seconds of inactivity)
    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false); // Typing has stopped
      typingStop();
    }, 2000); // 2 seconds delay
  };

  useEffect(() => {
    // Cleanup timeout when component unmounts
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const chatEndRef = useRef<HTMLDivElement | null>(null); // Ref for the last element to scroll into

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allmessage]);

  const formatMessageDate = (date: Date): string => {
    return format(date, "MMMM d, yyyy"); // Example format: "October 13, 2024"
  };

  return (
    <>
      <div className="border-l border-gray-200  min-h-[400px] max-h-[400px] overflow-scroll bg-slate-100 p-6">
        {allmessage &&
          allmessage.map((message: messageType, index: number) => {
            const showDateSeparator =
              index === 0 || // Show for the first message
              !isSameDay(message.createdAt, allmessage[index - 1]?.createdAt); // Show if this message is on a different day
            return (
              <>
                <div key={index}>
                  {showDateSeparator && (
                    <div className="flex justify-center clear-both">
                      <div className="bg-white px-4 py-2 text-sm rounded-full">
                        {isSameDay(message.createdAt, new Date())
                          ? "Today"
                          : formatMessageDate(message.createdAt)}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                  {message?.senderId === user?._id ? (
                    <>
                      <div className="flex items-center gap-x-4 py-3 clear-both">
                        <div className="w-14 h-12 rounded-full bg-gray-400 overflow-hidden ">
                          <img
                            src="https://w7.pngwing.com/pngs/140/543/png-transparent-logo-company-business-business-blue-angle-company.png"
                            className="w-14 h-12 object-contain object-center"
                          />
                        </div>

                        <div className="w-full">
                          <div className="flex items-center gap-x-6">
                            <div className="font-bold">
                              {currentchat?.senderName}
                            </div>
                            <div className="text-sm text-gray-400">
                              {moment(message.createdAt).calendar()}
                            </div>
                          </div>
                          <div className="bg-white w-fit px-4 py-2 text-sm rounded-tr-xl rounded-br-xl rounded-bl-xl">
                            {/* {message.text} */}
                            {message.isForm === true &&
                            message.isFormSubmitted === false
                              ? // <LoadForm form={message.formId} msg={message} />
                                message.text
                              : message.isForm === true &&
                                message.isFormSubmitted === true
                              ? "Form submitted!"
                              : message.text}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="flex items-center justify-end gap-x-4 py-3 float-right w-full clear-both"
                        ref={chatEndRef}
                      >
                        <div className="w-full">
                          <div className="flex items-center gap-x-6 justify-end">
                            <div className="text-sm text-gray-400">
                              {moment(message.createdAt).calendar()}
                            </div>
                            <div className="font-bold">You</div>
                          </div>
                          <div className="float-right">
                            <div className="flex items-center gap-x-1">
                              <div className="">
                                <CheckIcon
                                  className={`w-4 ${
                                    message.isRead
                                      ? "stroke-green-500"
                                      : "stroke-gray-300"
                                  }`}
                                />
                              </div>
                              <div className="bg-blue-400 text-white w-fit px-4 py-2 text-sm rounded-tl-xl rounded-br-xl rounded-bl-xl">
                                {/* {message.isForm
                                  ? message.isFormSubmitted === true &&
                                    message?.senderId !== user?._id &&
                                    "Form submitted - " +
                                      message.formId.formName
                                  : message?.senderId !== user?._id &&
                                    message.isFormSubmitted === false
                                  ?  <LoadForm
                                      form={message.formId}
                                      msg={message}
                                    />
                                  : message.text} */}
                                {/* {message.text} */}
                                {message.isForm === true &&
                                message.isFormSubmitted === false ? (
                                  <LoadForm
                                    form={message.formId}
                                    msg={message}
                                  />
                                ) : message.isForm === true &&
                                  message.isFormSubmitted === true ? (
                                  message.text &&
                                  objectToTable(JSON.parse(message.text))
                                ) : (
                                  // message.text
                                  message.text
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-14 h-12 rounded-full bg-gray-400 overflow-hidden ">
                          <img
                            src="https://w7.pngwing.com/pngs/140/543/png-transparent-logo-company-business-business-blue-angle-company.png"
                            className="w-14 h-12 object-contain object-center"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            );
          })}
      </div>
      <div className="flex items-center gap-x-4 px-6 py-2">
        <textarea
          className="px-2 py-1 form-textarea"
          onChange={changeMessage}
          defaultValue={message}
        ></textarea>
        <button
          className="text-white bg-blue-400 rounded-lg px-5 py-2"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </>
  );
};

const DownloadContainer = () => {
  const { toogleUDForm, sendFormMessage } = useContext(ChatContext);
  const [downloadformlist, setdownloadformlist] = useState<any>();

  useEffect(() => {
    getRequest(`${baseUrl}/forms`)
      .then((res: any) => {
        setdownloadformlist(res.response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <div className="w-[24rem] h-[200px] overflow-scroll absolute -right-10 top-10">
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <div>Upload Form</div>
              <div>
                <XMarkIcon
                  className="w-6 stroke-gray-300 cursor-pointer"
                  onClick={() => toogleUDForm({ type: "download" })}
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="">
              {downloadformlist &&
                downloadformlist.map((form: formDataType, i: number) => {
                  return (
                    <>
                      <div
                        key={i}
                        className={`py-1 px-2 text-gray-600 border-b border-b-gray-600 bg-gray-100 cursor-pointer`}
                        onClick={() => sendFormMessage(form)}
                      >
                        {form.formName}
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const LoadForm = (props: any) => {
  const { messageFormSubmit } = useContext(ChatContext);
  const [formdata, setformdata] = useState<any>();
  const [collectdata, setcollectdata] = useState<any>({});
  const [alert, setalert] = useState<any>({ status: false, message: "" });
  useEffect(() => {
    if (props.form !== undefined) {
      console.log(props);
      setformdata(props.form);
      formdata &&
        formdata?.formData.map((data: formType) => {
          collectdata[data.name] = data.default;
        });
    }
  }, []);

  const formChange = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setcollectdata({ ...collectdata, [evt.name]: evt.value });
  };

  const formSubmit = async () => {
    setalert({ status: false, message: "" });
    formdata.formData.map((data: formType) => {
      Object.keys(collectdata).some((key) => {
        if (key === data.name && data.required === true && !collectdata[key]) {
          setalert({ status: true, message: "*Some fileds are missing" });
          return;
        }
      });
    });
    // console.log(props.msg.formId);
    await messageFormSubmit({
      Id: props.msg._id,
      chatId: props.msg.chatId,
      formId: props.msg.formId._id,
      triggerId: props.msg.formId.triggerId,
      formData: collectdata,
    });
  };
  return (
    <>
      <div className="max-w-[250px] min-w-[250px]">
        {formdata &&
          formdata?.formData.map((dd: formType, k: number) => (
            <>
              <div className="py-1">
                <div className="flex items-center justify-between py-1">
                  <div>
                    <label className="flex">
                      {dd.label}
                      {dd.required && <div className="text-red-500">*</div>}
                    </label>
                  </div>
                </div>
                <input
                  type={dd.type}
                  name={dd.name}
                  value={collectdata[dd.name]}
                  className="form-input"
                  placeholder={dd.placeholder}
                  onChange={formChange}
                />
              </div>
            </>
          ))}
        <div className="py-1">
          <div className="flex justify-between items-center">
            <div>
              <button
                className="bg-blue-500 text-white rounded-lg px-5 py-2"
                onClick={formSubmit}
              >
                Submit
              </button>
            </div>
            <div></div>
          </div>
        </div>
        {alert.status && (
          <div className="bg-red-100 text-red-500 px-2 py-1 rounded-lg">
            {alert.message}
          </div>
        )}
      </div>
    </>
  );
};

const UploadContainer = () => {
  const { toogleUDForm, allformsubmitdata } = useContext(ChatContext);
  const [collectdata, setcollectdata] = useState<any>();

  useEffect(() => {
    // console.log(allformsubmitdata);
    let collect: any = allformsubmitdata;
    collect.map((dd: any, i: number) => {
      dd.formData.map((data: formType) => {
        // console.log(data);
        Object.keys(dd.formSubmitData).some((key) => {
          // console.log(key, dd.formSubmitData[key]);
          if (key === data.name) {
            collect[i].formSubmitData[data.label] = dd.formSubmitData[key];
            delete collect[i].formSubmitData[data.name];
          }
        });
      });
    });
    setcollectdata(collect);
  }, []);
  return (
    <>
      <div className="w-[24rem] h-[200px] overflow-scroll absolute -right-10 top-10">
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <div>Upload Form</div>
              <div>
                <XMarkIcon
                  className="w-6 stroke-gray-300 cursor-pointer"
                  onClick={() => toogleUDForm({ type: "upload" })}
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="">
              {collectdata &&
                collectdata.map((form: any, i: number) => {
                  return (
                    <>
                      <div
                        key={i}
                        className={`${
                          i !== collectdata.length - 1 &&
                          "border-b border-gray-300"
                        }`}
                      >
                        <h2 className="text-xl text-gray-600">
                          {form.formName}
                        </h2>
                        <ul className="list-disc px-6">
                          {form.formSubmitData &&
                            Object.keys(form.formSubmitData).map((key) => (
                              <li>{key + ": " + form.formSubmitData[key]}</li>
                            ))}
                        </ul>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Main;
