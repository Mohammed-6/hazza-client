import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { listFormType } from "../types/form";
import { baseUrl, getRequest } from "@/utils/services";
import { AuthContext } from "@/context/authContext";
import { ChatContextProvider } from "@/context/chatContext";
import LayoutView from "../layout";
import { Menu } from "../chat";

const ListForm = () => {
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
    const findForm = () => {
      getRequest(`${baseUrl}/forms`)
        .then((res: any) => {
          setcollectdata(res.response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    findForm();
  }, []);

  const deleteForm = (id: string) => {
    getRequest(`${baseUrl}/forms/delete/${id}`)
      .then((res: any) => {
        setcollectdata(res.response.data);
        setalert({
          status: true,
          type: "error",
          message: "Form deleted successfully.",
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
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-x-4">
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between">
              <div>List User</div>
              <div>
                <Link href="/form/add" className="btn btn-primary">
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
                  <td className="border p-2">Form Name</td>
                  <td className="border p-2">Created on</td>
                  <td className="border p-2">Action</td>
                </tr>
              </thead>
              <tbody>
                {collectdata !== undefined &&
                  collectdata.map((data: any, i) => (
                    <tr>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{data.formName}</td>
                      <td className="border p-2">
                        {new Date(data.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="border p-2">
                        <div className="flex items-center gap-x-3">
                          <div className="">
                            <Link
                              href={`/form/${data._id}`}
                              className="btn btn-primary"
                            >
                              Edit
                            </Link>
                          </div>
                          <div className="">
                            <button
                              onClick={() => deleteForm(data._id)}
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

export default ListForm;
