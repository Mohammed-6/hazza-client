import { AuthContextType, authProp } from "@/src/types/auth";
import { baseUrl, postRequest } from "@/utils/services";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";

export const AuthContext = createContext<AuthContextType | any>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setuser] = useState<authProp | null>(null);
  const [showlogin, setshowlogin] = useState<boolean>(true);
  const [registerinfo, setregisterinfo] = useState<authProp>({
    name: "",
    email: "",
    password: "",
  });
  const [registererror, setregistererror] = useState(null);
  const [registersuccess, setregistersuccess] = useState<boolean>(false);
  const [isregisterloading, setisregisterloading] = useState<boolean>(false);
  const [logininfo, setlogininfo] = useState<authProp>({
    email: "",
    password: "",
  });
  const [loginerror, setloginerror] = useState(null);
  const [isloginloading, setisloginloading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("user")) {
        setuser(JSON.parse(localStorage.getItem("user") as string));
      } else {
        router.push("/login");
      }
    }
  }, []);

  const switchLoginReg = useCallback(() => {
    setshowlogin(!showlogin);
  }, [showlogin]);

  const updateRegisterinfo = useCallback((info: authProp) => {
    setregisterinfo(info);
    // console.log(info);
  }, []);

  const submitRegisterinfo = useCallback(
    async (e: any) => {
      e.preventDefault();
      setisregisterloading(true);
      setregistersuccess(false);
      const response: any = await postRequest(
        `${baseUrl}/users/register`,
        registerinfo
      );

      if (response?.error) {
        setregistererror(response);
        setisregisterloading(false);
        return;
      }
      setregistersuccess(true);

      setregistererror(null);
      setisregisterloading(false);
      setregistererror(response?.response?.data);
    },
    [registerinfo]
  );

  const updateLogininfo = useCallback((info: authProp) => {
    setlogininfo(info);
    // console.log(info);
  }, []);

  const submitLogininfo = useCallback(
    async (e: any) => {
      e.preventDefault();
      setisloginloading(true);
      const response: any = await postRequest(
        `${baseUrl}/users/login`,
        logininfo
      );

      if (response?.error) {
        setloginerror(response);
        setisloginloading(false);
        return;
      }

      setloginerror(null);
      setisloginloading(false);
      setloginerror(response?.response?.data);

      localStorage.setItem("user", JSON.stringify(response?.response?.data));
      // router.push("/chat");
      window.location.replace("/chat");
    },
    [logininfo]
  );
  return (
    <AuthContext.Provider
      value={{
        user,
        registerinfo,
        updateRegisterinfo,
        submitRegisterinfo,
        isregisterloading,
        registererror,
        registersuccess,
        showlogin,
        switchLoginReg,
        logininfo,
        updateLogininfo,
        submitLogininfo,
        isloginloading,
        loginerror,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
