import { authProp } from "@/src/types/auth";
import {
  ChatContextType,
  currentChatType,
  isTypingType,
  istypinglist,
  listAllMessages,
  messageType,
  userlistType,
} from "@/src/types/chat";
import { formDataType, listFormType } from "@/src/types/form";
import { baseUrl, getRequest, postRequest } from "@/utils/services";
import {
  ReactNode,
  useState,
  createContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Socket, io } from "socket.io-client";

export const ChatContext = createContext<ChatContextType | any>(undefined);

// client to server
interface ClientToServerEvents {
  message: (arg: string) => void;
  createChat: (arg: { userId: string; senderId: string }) => void;
  init: (arg: any) => void;
  isTyping: (arg: any) => void;
  chatRoom: (arg: any) => void;
  sendMessage: (arg: any) => void;
  newInit: (arg: any) => void;
  userInit: (arg: any) => void;
  typingStop: (arg: any) => void;
  messageRead: (arg: any) => void;
  messageFormData: (arg: any) => void;
  sendFormMessage: (arg: any) => void;
}
interface ServerToClientEvents {
  [event: string]: (...args: any) => void;
  typing: (args: any) => void;
  newChat: (...args: any) => void;
  stopTyping: (args: any) => void;
  onlineUsers: (args: any) => void;
  formDataUpdated: (args: any) => void;
}

export const ChatContextProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user: authProp;
}) => {
  const [allusers, setallusers] = useState(null);
  const [isallusersloading, setisallusersloading] = useState<boolean>(false);
  const [showusers, setshowusers] = useState<boolean>(false);
  const [chatusers, setchatusers] = useState<any>(null);
  const [ischatloading, setischatloading] = useState<boolean>(false);
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const [currentchat, setcurrentchat] = useState<currentChatType | null>(null);
  const [message, setmessage] = useState<string>("");
  const [istyping, setistyping] = useState<any>([]);
  const [allmessage, setallmessage] = useState(listAllMessages);
  const [unreadmessage, setunreadmessage] = useState<any>([]);
  const [shownotification, setshownotification] = useState<boolean>(false);
  const [onlineUsers, setonlineUsers] = useState<any>([]);
  const [showdownloadform, setshowdownloadform] = useState<boolean>(false);
  const [showuploadform, setshowuploadform] = useState<boolean>(false);
  const [allformsubmitdata, setallformsubmitdata] = useState<any>([]);

  useEffect(() => {
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      "https://hazza-server.exllab.in",
      {
        reconnection: true, // Enable reconnection
        reconnectionAttempts: 5, // Try reconnecting 5 times
        reconnectionDelay: 1000, // Time between attempts (in ms)
        timeout: 20000, // Timeout before considering the connection lost
      }
    );
    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    setischatloading(true);
    async function getAllUsers() {
      const response: any = await getRequest(`${baseUrl}/chats/${user?._id}`);

      if (response?.error) {
        console.log(response?.message);
        setischatloading(false);
        return;
      }
      //   console.log(response);
      const allChatUsers = response?.response?.data.filter(
        (u: userlistType) => u._id !== user?._id
      );

      //   console.log(response);
      setchatusers(allChatUsers);
      const newSocket = socketRef.current;
      allChatUsers &&
        allChatUsers.map((u: userlistType) => {
          newSocket?.emit("init", {
            chatId: u._id,
            userId: "",
            senderId: "",
          });
        });

      setischatloading(false);
    }
    getAllUsers();
    // console.log(user);
  }, [user]);

  useEffect(() => {
    const newSocket = socketRef.current;
    newSocket?.emit("userInit", { userId: user?._id });
    newSocket?.on("onlineUsers", (u) => {
      setonlineUsers(u);
    });
  }, [user]);

  useEffect(() => {
    const tt = currentchat?.userId;
    const newSocket = socketRef.current;
    newSocket?.on("typing", function (info: any) {
      //   console.log(info);
      const index = istyping.findIndex((i: any) => i.userId === info.senderId);
      //   console.log(index);
      if (index === -1) {
        setistyping((prevTyping: any) => [
          ...prevTyping,
          { type: true, userId: info.senderId },
        ]);
      } else {
        const temp = [...istyping];
        temp[index].type = true;
        setistyping(temp);
      }
    });

    return () => {
      newSocket?.off("typing");
    };
  }, [user, currentchat, istyping]);

  useEffect(() => {
    const newSocket = socketRef.current;
    newSocket?.on("newMessage", (info) => {
      console.log("New message:", info);
      //   if (info.senderId === user?._id) {
      if (currentchat && currentchat.chatId === info.chatId) {
        setallmessage((prev) => [...prev, info]);
        const readInfo = {
          userId: currentchat.userId,
          chatId: currentchat.chatId,
        };
        newSocket?.emit("messageRead", readInfo);
        postRequest(`${baseUrl}/messages/read`, readInfo);
      } else {
        setunreadmessage((prev: any) => [...prev, info]);
      }
      //   }
    });

    return () => {
      newSocket?.off("newMessage");
    };
  }, [user, currentchat, allmessage]);

  useEffect(() => {
    const newSocket = socketRef.current;

    newSocket?.on("readMessage", (info) => {
      if (currentchat?.chatId === info.chatId && user._id === info.userId) {
        const updateMessages = allmessage.map((msg: messageType) => ({
          ...msg,
          isRead: true,
        }));
        setallmessage(updateMessages);
        // console.log(updateMessages);
      }
    });
    return () => {
      newSocket?.off("readMessage");
    };
  }, [currentchat, allmessage]);

  const makeCurrentChat = useCallback(
    async (info: currentChatType) => {
      setshowdownloadform(false);
      setshowuploadform(false);
      const newSocket = socketRef.current;
      const response = await postRequest(`${baseUrl}/chats`, {
        firstid: info.userId,
        secondid: info.senderId,
      });

      if (response.error) {
        console.log(response);
        return;
      }

      setcurrentchat(info);

      const filterUnreadmessage = unreadmessage.filter(
        (un: any) => un.chatId !== info.chatId
      );
      setunreadmessage(filterUnreadmessage);
      const res: any = await getRequest(
        `${baseUrl}/messages/${info.chatId}/${user?._id}`
      );

      if (res?.error) {
        console.log(res);
        return;
      }
      const readInfo = { userId: info.userId, chatId: info.chatId };
      setallmessage(res?.response?.data);
      res?.response?.data.map((data: messageType) => {
        if (data.isFormSubmitted === true && data.isForm === true) {
          const temp = {
            formName: data.formId?.formName,
            formData: data.formId?.formData,
            formSubmitData: data.text,
            // formSubmitData: JSON.parse(data.text),
          };
          //   console.log(JSON.parse(data.text));
          setallformsubmitdata([...allformsubmitdata, temp]);
          //   console.log(JSON.parse(data.text));
        }
      });
      newSocket?.emit("messageRead", readInfo);
      postRequest(`${baseUrl}/messages/read`, readInfo);
    },
    [user]
  );
  // type message
  const typeMessage = useCallback(
    (info: {
      userId: string;
      senderId: string;
      chatId: string;
      message: string;
    }) => {
      //   console.log(info);
      const newSocket = socketRef.current;
      newSocket?.emit("isTyping", info);
      //   console.log(info);
      setmessage(info.message);
    },
    []
  );

  const sendMessage = useCallback(async () => {
    if (message == "") return;
    const newSocket = socketRef.current;
    const tempData = {
      chatId: currentchat?.chatId,
      senderId: currentchat?.userId,
      text: message,
    };
    const response: any = await postRequest(`${baseUrl}/messages`, tempData);

    if (response?.error) {
      console.log(response);
      return;
    }
    newSocket?.emit("sendMessage", tempData);
    // setallmessage((prev) => [...prev, response?.response?.data]);
    setmessage("");
    return () => newSocket?.off("sendMessage");
  }, [message]);

  const loadAllUsers = async () => {
    setisallusersloading(true);
    const response: any = await getRequest(`${baseUrl}/users`);

    if (response?.error) {
      console.log(response?.message);
      setisallusersloading(false);
      return;
    }
    //   console.log(response);
    const allChatUsers = response?.response?.data.filter(
      (u: userlistType) => u._id !== user?._id
    );

    setisallusersloading(false);
    setallusers(allChatUsers);
  };

  const toogleUsers = useCallback(async () => {
    setshowusers(!showusers);
    if (showusers === false) {
      loadAllUsers();
    }
  }, [showusers]);

  const typingStop = useCallback(async () => {
    const newSocket = socketRef.current;
    // console.log("typing stop");
    newSocket?.emit("typingStop", {
      userId: currentchat?.userId,
      senderId: currentchat?.senderId,
      chatId: currentchat?.chatId,
    });
  }, [currentchat]);

  useEffect(() => {
    const newSocket = socketRef.current;
    newSocket?.on("stopTyping", function (info: any) {
      //   console.log(info);
      const index = istyping.findIndex((i: any) => i.userId === info.senderId);
      //   console.log(index);
      if (index !== -1) {
        const temp = [...istyping];
        temp[index].type = false;
        setistyping(temp);
      }
    });

    return () => {
      newSocket?.off("stopTyping");
    };
  }, [user, currentchat, istyping]);

  useEffect(() => {
    const newSocket = socketRef.current;

    newSocket?.on("newChat", (info) => {
      setchatusers((prev: any) => [...prev, info]);
      newSocket?.emit("init", {
        chatId: info._id,
        userId: "",
        senderId: "",
      });
    });

    return () => {
      newSocket?.off("newChat");
    };
  }, [user, currentchat]);

  const createChat = useCallback(
    async (info: currentChatType) => {
      const newSocket = socketRef.current;
      //   console.log(info);
      const response: any = await postRequest(`${baseUrl}/chats`, {
        firstid: info.userId,
        secondid: info.senderId,
      });

      if (response.error) {
        console.log(response);
        return;
      }

      const temp = response?.response?.data;

      const checkChatUsers = chatusers?.find((c: any) => c._id === temp._id);

      if (checkChatUsers === undefined) {
        setchatusers((prev: any) => [...prev, temp]);
        newSocket?.emit("newInit", {
          chatId: temp?._id,
          userId: info.userId,
          chatInfo: temp,
        });
      }

      const infor = {
        userId: info.userId,
        senderId: info.senderId,
        senderName: info.senderName,
        chatId: temp?._id,
      };
      setcurrentchat(infor);
      const res: any = await getRequest(
        `${baseUrl}/messages/${temp?._id}/${user?._id}`
      );

      if (res?.error) {
        console.log(res);
        return;
      }
      setallmessage(res?.response?.data);
      setshowusers(false);
    },
    [user]
  );

  const toogleUDForm = useCallback(
    (info: { type: string }) => {
      if (info.type === "upload") {
        setshowdownloadform(false);
        setshowuploadform(!showuploadform);
      }
      if (info.type === "download") {
        setshowuploadform(false);
        setshowdownloadform(!showdownloadform);
      }
    },
    [showdownloadform, showuploadform]
  );

  const sendFormMessage = useCallback(
    async (formId: formDataType) => {
      if (formId._id == "") return;
      const newSocket = socketRef.current;
      const tempData = {
        chatId: currentchat?.chatId,
        senderId: user?._id,
        formId: formId,
        triggerId: formId.triggerId,
        // text: message,
      };
      //   console.log(tempData);
      //   return;
      const response: any = await postRequest(
        `${baseUrl}/messages/form`,
        tempData
      );

      if (response?.error) {
        console.log(response);
        return;
      }
      console.log(response?.response?.data);
      newSocket?.emit("sendFormMessage", response?.response?.data);
      //   setallmessage((prev) => [...prev, response?.response?.data]);
      //   setmessage("");
      setshowdownloadform(false);
      return () => newSocket?.off("sendFormMessage");
    },
    [currentchat, message, user]
  );

  const toogleNotification = useCallback(() => {
    setshownotification(!shownotification);
  }, [shownotification]);

  const messageFormSubmit = useCallback(
    async (info: {
      Id: string;
      chatId: string;
      formId: string;
      formData: any;
      triggerId: string;
    }) => {
      const newSocket = socketRef.current;
      const tempData = {
        chatId: currentchat?.chatId,
        senderId: currentchat?.userId,
        Id: info.Id,
        formId: info.formId,
        triggerId: info.triggerId,
        isFormSubmitted: true,
        text: JSON.stringify(info.formData),
      };

      const response: any = await postRequest(
        `${baseUrl}/messages/form-submit`,
        tempData
      );

      if (response.error) {
        console.log(response);
        return;
      }

      setallmessage((prevMsg) =>
        prevMsg.map((msg: any) =>
          msg._id === info.Id
            ? { ...msg, isFormSubmitted: true, isForm: false }
            : msg
        )
      );
      console.log(response.response.data);

      const tempFormData = {
        chatId: currentchat?.chatId,
        senderId: currentchat?.userId,
        Id: info.Id,
        formId: info.formId,
        triggerId: info.triggerId,
        isFormSubmitted: true,
        text: JSON.stringify(response.response.data),
      };

      newSocket?.emit("sendFormMessage", response.response.data);
    },
    [currentchat, message]
  );

  useEffect(() => {
    const newSocket = socketRef.current;

    newSocket?.on("formDataUpdated", function (info) {
      if (currentchat?.chatId === info.chatId) {
        // console.log(info);
        setallmessage((prevMsg) =>
          prevMsg.map((msg: any) =>
            msg._id === info.Id
              ? { ...msg, text: info.text, isFormSubmitted: true }
              : msg
          )
        );
      }
    });
  }, [currentchat]);
  return (
    <ChatContext.Provider
      value={{
        chatusers,
        makeCurrentChat,
        currentchat,
        ischatloading,
        typeMessage,
        istyping,
        sendMessage,
        allmessage,
        message,
        allusers,
        isallusersloading,
        showusers,
        toogleUsers,
        createChat,
        unreadmessage,
        typingStop,
        shownotification,
        toogleNotification,
        onlineUsers,
        showdownloadform,
        showuploadform,
        toogleUDForm,
        sendFormMessage,
        messageFormSubmit,
        allformsubmitdata,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
