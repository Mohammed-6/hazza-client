import { useContext, useEffect, useState } from "react";
import { formDataType, formType, listFormType } from "../types/form";
import LayoutView from "../layout";
import { AuthContext } from "@/context/authContext";
import { ChatContextProvider } from "@/context/chatContext";
import { baseUrl, getRequest, makeid, postRequest } from "@/utils/services";
import { useRouter } from "next/router";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { triggerType } from "../types/trigger";

const AddEdit = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      {user && (
        <ChatContextProvider user={user}>
          <LayoutView>
            <div className="p-standard">
              <Content />
            </div>
          </LayoutView>
        </ChatContextProvider>
      )}
    </>
  );
};

const Content = () => {
  const router = useRouter();
  const [collectdata, setcollectdata] = useState(listFormType);
  const [formdata, setformdata] = useState<formDataType>({
    formName: "",
    triggerId: "",
    formData: null,
  });
  const [showproperties, setshowproperties] = useState<boolean>(false);
  const [propertydata, setpropertydata] = useState<formType>({
    type: "text",
    title: "",
    default: "",
    label: "",
    name: "",
    placeholder: "",
    required: false,
  });
  const [propertykey, setpropertykey] = useState<number>(0);
  const [alert, setalert] = useState<any>({
    status: false,
    type: "",
    message: "",
  });
  const [triggerlist, settriggerlist] = useState<any>();

  useEffect(() => {
    const id = router.query.id;
    setalert({
      status: false,
      type: "",
      message: "",
    });
    if (id) {
      const findForm = () => {
        getRequest(`${baseUrl}/forms/${id}`)
          .then((res: any) => {
            setformdata(res.response.data);
            if (res.response.data.formData !== null) {
              setcollectdata(res.response.data.formData);
            }
          })
          .catch((err) => {
            setalert({
              status: true,
              type: "error",
              message:
                "Form name required! please look console for more information.",
            });
          });
      };

      findForm();
    }
  }, [router.query.id]);

  useEffect(() => {
    getRequest(`${baseUrl}/get-trigger-list`)
      .then((res: any) => {
        settriggerlist(res.response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addInput = () => {
    const dd: formType = {
      type: "text",
      title: "",
      default: "",
      name: makeid(6),
      label: "",
      placeholder: "",
      required: false,
    };
    setcollectdata([...collectdata, dd]);
  };

  const formChange = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setformdata({ ...formdata, formName: evt.value });
  };

  const triggerChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const evt = e.target as HTMLSelectElement;
    setformdata({ ...formdata, triggerId: evt.value });
  };

  const editProperty = (key: number, data: formType) => {
    setpropertykey(key);
    setpropertydata(data);
    setshowproperties(true);
  };
  const updateProperty = (data: formType) => {
    const temp: any = collectdata;
    temp[propertykey] = data;
    setcollectdata(temp);
    setformdata({ ...formdata, formData: temp });
    setshowproperties(false);
  };
  const cancelProperty = () => {
    setshowproperties(false);
  };

  const formSubmit = async () => {
    setalert({ status: false, message: "" });
    if (formdata.formName === "") {
      setalert({
        status: true,
        type: "error",
        message: "Form name required!",
      });
      return;
    }

    if (router.query.id !== undefined && router.query.id !== "") {
      const response: any = await postRequest(
        `${baseUrl}/forms/${router.query.id}`,
        formdata
      );

      if (response.error) {
        setalert({ status: true, type: "error", message: response?.message });
        return;
      }

      setalert({
        status: true,
        type: "success",
        message: response?.response?.data,
      });
      router.push("/trigger");
    } else {
      const response: any = await postRequest(`${baseUrl}/forms`, formdata);

      if (response.error) {
        setalert({ status: true, type: "error", message: response?.message });
        return;
      }

      setalert({
        status: true,
        type: "success",
        message: response?.response?.data,
      });
      router.push("/trigger");
    }
  };

  const removeFormData = (id: number) => {
    const flt = collectdata.filter((_: any, i: number) => i !== id);
    setcollectdata(flt);
  };
  return (
    <>
      <div className="mx-auto max-w-xl">
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between">
              <div>Form Add/Edit</div>
              <div>
                <Link href="/form" className="btn btn-primary">
                  List
                </Link>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="flex justify-between items-end">
              <div>
                <label>Form Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Form Name"
                  value={formdata.formName}
                  onChange={formChange}
                />
              </div>
              <button
                className="bg-green-500 px-5 py-1 rounded-lg text-white"
                onClick={addInput}
              >
                Add
              </button>
            </div>
            <div className="py-2">
              <label>Trigger</label>
              <select
                className="form-input"
                value={formdata.triggerId}
                onChange={triggerChange}
              >
                <option value="">Select Trigger</option>
                {triggerlist &&
                  triggerlist.map((trigger: triggerType, i: number) => (
                    <option value={trigger.triggerId} key={i}>
                      {trigger.triggerName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="py-1">
              {collectdata &&
                collectdata.map((dd: formType, k: number) => (
                  <>
                    <div className="py-1">
                      <div className="flex items-center justify-between py-1">
                        <div>
                          <label className="">{dd.label}</label>
                        </div>
                        <div className="flex gap-x-1">
                          <button
                            className="text-white bg-green-500 px-4 py-1 rounded-lg"
                            onClick={() => editProperty(k, dd)}
                          >
                            Porperties
                          </button>
                          <div>
                            <XMarkIcon
                              className="w-10 p-2 bg-red-500 rounded-lg stroke-white cursor-pointer"
                              onClick={() => removeFormData(k)}
                            />
                          </div>
                        </div>
                      </div>
                      <input
                        type={dd.type}
                        value={dd.default}
                        className="form-input"
                        placeholder={dd.placeholder}
                      />
                    </div>
                  </>
                ))}
              <div className=""></div>
            </div>
            <div className="pt-1">
              <div className="flex justify-between items-center">
                <div>
                  <button
                    className="bg-green-500 text-white rounded-lg px-5 py-2"
                    onClick={formSubmit}
                  >
                    Submit
                  </button>
                </div>
                <div></div>
              </div>
            </div>
            <div className="py-2">
              {alert.status && (
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
              )}
            </div>
          </div>
        </div>
      </div>
      {showproperties ? (
        <Properties
          key={propertykey}
          data={propertydata}
          submit={updateProperty}
          cancel={cancelProperty}
        />
      ) : (
        ""
      )}
    </>
  );
};

type propertyType = {
  key: number;
  data: formType;
  submit: Function;
  cancel: Function;
};
const Properties = (props: propertyType) => {
  const [collectdata, setcollectdata] = useState<formType>(props.data);

  useEffect(() => {
    setcollectdata(collectdata);
  }, []);

  const formChange = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setcollectdata({ ...collectdata, [evt.name]: evt.value });
  };
  const formCheckboxChange = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setcollectdata({ ...collectdata, [evt.name]: evt.checked });
  };
  const formSelectChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const evt = e.target as HTMLSelectElement;
    setcollectdata({ ...collectdata, [evt.name]: evt.value });
  };

  const formSubmit = () => {
    props.submit(collectdata);
  };
  const cancelProperty = () => {
    props.cancel();
  };
  return (
    <div className="fixed inset-0 overflow-y-scroll bg-black/50">
      <div className="max-w-xl mx-auto">
        <div className="card">
          <div className="card-header">Properties</div>
          <div className="card-body">
            <div className="py-1">
              <label className="form-label">Type</label>
              <select
                name="type"
                className="px-2 py-2 rounded-md border border-gray-400 w-full"
                value={collectdata?.type}
                onChange={formSelectChange}
              >
                <option value={"text"}>text</option>
                <option value={"number"}>number</option>
                <option value={"password"}>password</option>
                <option value={"radio"}>radio</option>
                <option value={"checkbox"}>checkbox</option>
              </select>
            </div>
            <div className="py-1">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={collectdata?.title}
                onChange={formChange}
              />
            </div>
            <div className="py-1">
              <label className="form-label">Required?</label>
              <label className="flex gap-x-2">
                <input
                  type="checkbox"
                  name="required"
                  className=""
                  defaultChecked={collectdata?.required}
                  onChange={formCheckboxChange}
                />
                <div>{collectdata?.required ? "Yes" : "No"}</div>
              </label>
            </div>
            <div className="py-1">
              <label className="form-label">Default value</label>
              <input
                type="text"
                name="default"
                className="form-input"
                value={collectdata?.default}
                onChange={formChange}
              />
            </div>
            <div className="py-1">
              <label className="form-label">Label</label>
              <input
                type="text"
                name="label"
                className="form-input"
                value={collectdata?.label}
                onChange={formChange}
              />
            </div>
            <div className="py-1">
              <label className="form-label">Placeholder</label>
              <input
                type="text"
                name="placeholder"
                className="form-input"
                value={collectdata?.placeholder}
                onChange={formChange}
              />
            </div>
            <div className="pt-1">
              <div className="flex justify-between items-center">
                <div>
                  <button
                    className="bg-green-500 text-white rounded-lg px-5 py-2"
                    onClick={formSubmit}
                  >
                    Submit
                  </button>
                </div>
                <div>
                  <button
                    className="bg-red-500 text-white rounded-lg px-5 py-2"
                    onClick={cancelProperty}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEdit;
