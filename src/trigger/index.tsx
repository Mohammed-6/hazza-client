import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { listFormType } from "../types/form";
import { baseUrl, getRequest } from "@/utils/services";
import { AuthContext } from "@/context/authContext";
import { ChatContextProvider } from "@/context/chatContext";
import LayoutView from "../layout";
import { Menu } from "../chat";

const ListTrigger = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      {user && (
        <ChatContextProvider user={user}>
          <LayoutView>
            <div className="grid grid-cols-12">
              <div className="col-span-2">
                <Menu />
              </div>
              <div className="col-span-10">
                <Content />
              </div>
            </div>
          </LayoutView>
        </ChatContextProvider>
      )}
    </>
  );
};
const Content = () => {
  const [collectdata, setcollectdata] = useState(listFormType);
  const [alert, setalert] = useState<any>({
    status: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    const findTrigger = () => {
      getRequest(`${baseUrl}/get-trigger-list`)
        .then((res: any) => {
          //   console.log(res.response.data);
          setcollectdata(res.response.data.data);
        })
        .catch((err) => {
          console.log(err);
          setcollectdata([]);
        });
    };

    findTrigger();
  }, []);

  const deleteTrigger = (id: string) => {
    setalert({
      status: true,
      type: "error",
      message: "This function has been disabled",
    });
    setTimeout(
      () =>
        setalert({
          status: false,
          type: "error",
          message: "",
        }),
      3000
    );
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-x-4">
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between">
              <div>List Trigger</div>
              <div>
                <Link href="/trigger/add" className="btn btn-primary">
                  Create
                </Link>
              </div>
            </div>
          </div>
          <div className="card-body">
            {alert.status && (
              <div className="py-2">
                <div
                  className={`${
                    alert.type === "error"
                      ? "bg-red-100 text-red-500"
                      : alert.type === "success"
                      ? "bg-green-100 text-green-500"
                      : ""
                  } px-3 py-2 rounded-lg`}
                >
                  {alert.message}
                </div>
              </div>
            )}
            <table className="w-full border-collapse">
              <thead>
                <tr className="border">
                  <td className="border p-2">S.No</td>
                  <td className="border p-2">Trigger Name</td>
                  <td className="border p-2">Created on</td>
                  <td className="border p-2">Action</td>
                </tr>
              </thead>
              <tbody>
                {collectdata !== undefined &&
                  collectdata.map((data: any, i) => (
                    <tr>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{data.triggerName}</td>
                      <td className="border p-2">
                        {new Date(data.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="border p-2">
                        <div className="flex items-center gap-x-3">
                          <div className="">
                            <Link
                              href={`/trigger/${data.triggerId}`}
                              className="btn btn-primary"
                            >
                              Edit
                            </Link>
                          </div>
                          <div className="">
                            <button
                              onClick={() => deleteTrigger(data.triggerId)}
                              className="btn btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListTrigger;
