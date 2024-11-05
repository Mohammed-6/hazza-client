import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

const LoginView = () => {
  const { showlogin } = useContext(AuthContext);
  return (
    <>
      <div className="max-w-xl mx-auto">
        <div className="card">
          <div className="card-header">Login/Signup</div>
          <div className="card-body">
            {showlogin ? <Login /> : <Register />}
          </div>
        </div>
      </div>
    </>
  );
};

const Login = () => {
  const {
    switchLoginReg,
    logininfo,
    updateLogininfo,
    submitLogininfo,
    isloginloading,
    loginerror,
  } = useContext(AuthContext);

  const updateForm = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    updateLogininfo({ ...logininfo, [evt.name]: evt.value });
  };
  return (
    <>
      <div className="">
        <form onSubmit={submitLogininfo}>
          <div className="">
            <label>Email</label>
            <input
              className="form-input"
              type="email"
              placeholder=""
              name="email"
              onChange={updateForm}
            />
          </div>
          <div className="">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder=""
              onChange={updateForm}
            />
          </div>
          <button
            type="submit"
            className="my-2 text-white bg-indigo-700 text-sm block w-full px-5 py-2 rounded-lg"
          >
            {isloginloading ? "Getting you in..." : "Login"}
          </button>
          <div className="my-2">
            {loginerror?.error ? (
              <>
                <div className="bg-red-200 text-red-800 p-2 rounded-lg w-full">
                  {loginerror?.message}
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </form>
        <div className="text-center py-0">or</div>
        <button
          className="my-2 text-white bg-red-700 text-sm block w-full px-5 py-2 rounded-lg"
          onClick={switchLoginReg}
        >
          Register
        </button>
      </div>
    </>
  );
};

const Register = () => {
  const {
    registerinfo,
    updateRegisterinfo,
    submitRegisterinfo,
    isregisterloading,
    registererror,
    registersuccess,
    switchLoginReg,
  } = useContext(AuthContext);

  const updateForm = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    updateRegisterinfo({ ...registerinfo, [evt.name]: evt.value });
  };
  return (
    <>
      <div className="">
        <form onSubmit={submitRegisterinfo}>
          <div className="">
            <label>Name</label>
            <input
              className="form-input"
              type="text"
              placeholder=""
              name="name"
              onChange={updateForm}
            />
          </div>
          <div className="">
            <label>Email</label>
            <input
              className="form-input"
              type="email"
              placeholder=""
              name="email"
              onChange={updateForm}
            />
          </div>
          <div className="">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder=""
              onChange={updateForm}
            />
          </div>
          <button className="my-2 text-white bg-indigo-700 text-sm block w-full px-5 py-2 rounded-lg">
            {isregisterloading ? "Getting you in..." : "Regsiter"}
          </button>
          <div className="my-2">
            {registererror?.error ? (
              <>
                <div className="bg-red-200 text-red-800 p-2 rounded-lg w-full">
                  {registererror?.message}
                </div>
              </>
            ) : registersuccess ? (
              <>
                <div className="bg-green-200 text-green-800 p-2 rounded-lg w-full">
                  {"User register successfully"}
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="text-center py-0">or</div>
          <button
            type="submit"
            className="my-2 text-white bg-red-700 text-sm block w-full px-5 py-2 rounded-lg"
            onClick={switchLoginReg}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginView;
