export type authProp = {
  name?: string;
  email: string;
  password?: string;
  token?: string;
  _id?: string;
};

export interface AuthContextType {
  user: authProp;
  registerinfo: authProp;
  updateRegisterinfo: (info: authProp) => void;
  submitRegisterinfo: Function;
  isregisterloading: boolean;
  registererror: any;
  showlogin: boolean;
  switchLoginReg: Function;
  logininfo: authProp;
  updateLogininfo: (info: authProp) => void;
  submitLogininfo: Function;
  isloginloading: boolean;
  loginerror: any;
  registersuccess: string;
}
