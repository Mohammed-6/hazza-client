import { formDataType, formType } from "./form";

export type userlistType = {
  name: string;
  _id: string;
  members?: [{ _id: string; name: string }];
  isOnline?: boolean;
  lastMessage?: messageType | null;
  formId?: formDataType;
  isFormSubmitted?: boolean;
  isForm: boolean;
};

export interface ChatContextType {
  userlist: [userlistType];
  sendMessage: Function;
  makeCurrentChat: Function;
  currentchat: currentChatType;
  ischatloading: boolean;
  typeMessage: { typing: boolean; userId: string; senderId: string };
  istyping: isTypingType;
  allmessage: [messageType];
  message: string;
  allusers: userlistType;
  isallusersloading: boolean;
  showusers: boolean;
  toogleUsers: Function;
  createChat: Function;
  unreadmessage: [messageType];
  typingStop: Function;
  shownotification: boolean;
  toogleNotification: Function;
  onlineUsers: any;
  showdownloadform: boolean;
  showuploadform: boolean;
  toogleUDForm: Function;
  sendFormMessage: Function;
  messageFormSubmit: Function;
  allformsubmitdata: any;
}

export type currentChatType = {
  userId: string;
  senderId: string;
  senderName: string;
  chatId: string;
};

export type isTypingType = {
  type: boolean;
  userId: string | null;
};

export const istypinglist: isTypingType[] = [];

export type messageType = {
  chatId: string;
  senderId: string;
  text: string;
  isRead: boolean;
  isFormSubmitted?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  formId: formDataType;
  isForm: boolean;
};

export const listAllMessages: messageType[] = [];
