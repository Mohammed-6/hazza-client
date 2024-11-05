import React, { useEffect, useState } from "react";
import {
  ParamsPropsType,
  againstTriggerListType,
  againstTriggerType,
  alldataType,
  authorizationDataType,
  bodyType,
  headerType,
  listBodyType,
  listHeadersType,
  listParamsType,
  paramsType,
  triggerType,
} from "../types/trigger";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  createTrigger,
  getTrigger,
  getTriggerList,
  updateTrigger,
} from "../query/trigger";

import { useRouter } from "next/router";
import { toast } from "react-toastify";

const AddEdit = () => {
  return (
    <>
      <div className="p-standard">
        <Content />
      </div>
    </>
  );
};

const Content = () => {
  const router = useRouter();
  const [collectdata, setcollectdata] = useState<triggerType>({
    triggerId: 0,
    triggerName: "",
    type: "get",
    url: "",
    queryReturn: null,
    params: false,
    paramsData: [],
    authorization: false,
    authorizationData: {
      selectType: "",
      key: "",
      value: "",
      addTo: "",
      token: "",
      username: "",
      password: "",
    },
    headers: false,
    headersData: null,
    body: false,
    bodyData: null,
    internalLink: "",
    externalLink: "",
  });
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    if (router.query.editid !== "" && router.query.editid !== undefined) {
      getTrigger(router.query.editid as string)
        .then((trigger) => {
          setcollectdata(trigger.data.data);
          setloading(true);
        })
        .catch((err) => {
          toast.error(err.message);
          setloading(true);
        });
    } else {
      setloading(true);
    }
  }, [router.isReady]);

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

  const paramsReturn = (data: paramsType) => {
    setcollectdata({ ...collectdata, paramsData: data });
    console.log(data);
  };

  const authorizationReturn = (data: authorizationDataType) => {
    setcollectdata({ ...collectdata, authorizationData: data });
    console.log(data);
  };

  const headersReturn = (data: headerType) => {
    setcollectdata({ ...collectdata, headersData: data });
    console.log(data);
  };

  const bodyReturn = (data: bodyType) => {
    setcollectdata({ ...collectdata, bodyData: data });
    console.log(data);
  };

  const queryReturn = (data: paramsType) => {
    setcollectdata({ ...collectdata, queryReturn: data });
    console.log(data);
  };

  const triggerSubmit = () => {
    if (router.query.editid !== "" && router.query.editid !== undefined) {
      updateTrigger(collectdata).then((res) => {
        console.log(res.data);
        router.push("/trigger");
      });
    } else {
      createTrigger(collectdata).then((res) => {
        console.log(res.data);
        router.push("/trigger");
      });
    }
  };

  return (
    <>
      <div className="">
        <div className="grid grid-cols-2 gap-x-2">
          <div className="">
            <div className="card">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <div>Add/Edit Trigger</div>
                  <div>
                    <button
                      className="bg-green-500 text-white text-sm rounded-md px-4 py-1"
                      onClick={triggerSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="">
                  <label className="form-label">Trigger Name</label>
                  <input
                    type="text"
                    className="form-input"
                    name="triggerName"
                    onChange={formChange}
                    value={collectdata.triggerName}
                  />
                </div>
                <div className="">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    name="type"
                    onChange={formSelectChange}
                    value={collectdata.type}
                  >
                    <option value={"get"}>GET</option>
                    <option value={"post"}>POST</option>
                    <option value={"put"}>PUT</option>
                    <option value={"patch"}>PATCH</option>
                    <option value={"delete"}>DELETE</option>
                    <option value={"head"}>HEAD</option>
                    <option value={"options"}>OPTIONS</option>
                  </select>
                </div>
                <div className="">
                  <label className="form-label">URL</label>
                  <input
                    type="text"
                    className="form-input"
                    name="url"
                    onChange={formChange}
                    value={collectdata.url}
                  />
                </div>
                <div className="flex items-center py-1">
                  <input
                    name="params"
                    id="checkbox-params"
                    type="checkbox"
                    onChange={formCheckboxChange}
                    defaultChecked={collectdata.params}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="checkbox-params"
                    className="ms-2 text-sm font-medium text-gray-900"
                  >
                    Params
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input
                    name="authorization"
                    id="checkbox-authorization"
                    type="checkbox"
                    onChange={formCheckboxChange}
                    defaultChecked={collectdata.authorization}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="checkbox-authorization"
                    className="ms-2 text-sm font-medium text-gray-900"
                  >
                    Authorization
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input
                    name="headers"
                    id="checkbox-headers"
                    type="checkbox"
                    onChange={formCheckboxChange}
                    defaultChecked={collectdata.headers}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="checkbox-headers"
                    className="ms-2 text-sm font-medium text-gray-900"
                  >
                    Headers
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input
                    name="body"
                    id="checkbox-body"
                    type="checkbox"
                    onChange={formCheckboxChange}
                    defaultChecked={collectdata.body}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="checkbox-body"
                    className="ms-2 text-sm font-medium text-gray-900"
                  >
                    Body
                  </label>
                </div>
                <div className="">
                  {collectdata.params ? (
                    <QueryReturn
                      returnBack={queryReturn}
                      data={collectdata.queryReturn}
                    />
                  ) : (
                    "Loading..."
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="card">
              <div className="card-header">Trigger Properties</div>
              <div className="card-body">
                {collectdata.params ? (
                  <Params
                    returnBack={paramsReturn}
                    data={collectdata.paramsData}
                  />
                ) : (
                  ""
                )}
                {collectdata.authorization ? (
                  <Authorization
                    returnBack={authorizationReturn}
                    data={collectdata.authorizationData}
                  />
                ) : (
                  ""
                )}
                {collectdata.headers ? (
                  <Headers
                    returnBack={headersReturn}
                    data={collectdata.headersData}
                  />
                ) : (
                  ""
                )}
                {collectdata.body ? (
                  <Body returnBack={bodyReturn} data={collectdata.bodyData} />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const AgainstTrigger = (props: ParamsPropsType) => {
  const [collectdata, setcollectdata] = useState<againstTriggerType>({
    switch: false,
    selected: null,
    querySelected: null,
  });
  const [triggerlist, settriggerlist] = useState(againstTriggerListType);
  const [querylist, setquerylist] = useState(listParamsType);
  const [showlist, setshowlist] = useState<boolean>(false);
  const [showqlist, setshowqlist] = useState<boolean>(false);

  useEffect(() => {
    getTriggerList()
      .then((triggerList) => {
        settriggerlist(triggerList.data.data);
        if (props.data.data !== undefined) {
          setcollectdata(props.data.data);
          triggerList.data.data.map((dd: any, l: number) => {
            if (dd.triggerId === props.data.data.selected) {
              setquerylist(dd.queryReturn);
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const formChange = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setcollectdata({ ...collectdata, [evt.name]: evt.checked });
  };

  const selecttrigger = (id: number, list: paramsType[]) => {
    setcollectdata({ ...collectdata, selected: id });
    setquerylist(list);
    setshowlist(false);
  };

  const selectquery = (id: number) => {
    setcollectdata({ ...collectdata, querySelected: id });
    setshowqlist(false);
  };

  const formSubmit = () => {
    props.returnBack(collectdata);
  };
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50">
        <div className="max-w-xl mx-auto top-3">
          <div className="card">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <div>Against Trigger Properties</div>
                <div>
                  <button
                    className="bg-green-500 rounded-md px-4 py-1 text-sm text-white"
                    onClick={formSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    name="switch"
                    defaultChecked={collectdata.switch}
                    className="sr-only peer"
                    onChange={formChange}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900">
                    {collectdata.switch ? "Enabled" : "Disabled"}
                  </span>
                </label>
              </div>
              <div>
                <label>Select Trigger</label>
                <div
                  className="rounded-md px-3 py-2 border text-gray-500 w-full mt-0"
                  onClick={() => {
                    setshowlist(!showlist);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      {collectdata.selected !== null
                        ? "Selected"
                        : "Select Trigger"}
                    </div>
                    <div>
                      {showlist ? (
                        <ChevronDownIcon className="w-4 stroke-gray-400" />
                      ) : (
                        <ChevronUpIcon className="w-4 stroke-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                {showlist ? (
                  <div className="rounded-md px-3 py-1 border text-gray-500 w-full mt-1">
                    {triggerlist.map((trigger, k) => (
                      <div
                        className={`flex items-center justify-between py-1 ${
                          k === triggerlist.length - 1
                            ? ""
                            : "border-b border-b-gray-100"
                        } `}
                        onClick={() =>
                          selecttrigger(trigger.triggerId, trigger.queryReturn)
                        }
                      >
                        <div>{trigger.triggerName}</div>
                        <div>
                          {collectdata.selected === trigger.triggerId ? (
                            <CheckIcon className="w-4 stroke-gray-400" />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
                <label>Select Query</label>
                <div
                  className="rounded-md px-3 py-2 border text-gray-500 w-full mt-0"
                  onClick={() => {
                    setshowqlist(!showqlist);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      {collectdata.querySelected !== null
                        ? "Selected"
                        : "Select Query"}
                    </div>
                    <div>
                      {showqlist ? (
                        <ChevronDownIcon className="w-4 stroke-gray-400" />
                      ) : (
                        <ChevronUpIcon className="w-4 stroke-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                {showqlist ? (
                  <div className="rounded-md px-3 py-1 border text-gray-500 w-full mt-1">
                    {querylist.map((trigger, k) => (
                      <div
                        className={`flex items-center justify-between py-1 ${
                          k === querylist.length - 1
                            ? ""
                            : "border-b border-b-gray-100"
                        } `}
                        onClick={() => selectquery(k)}
                      >
                        <div>{trigger.key}</div>
                        <div>
                          {collectdata.querySelected === k ? (
                            <CheckIcon className="w-4 stroke-gray-400" />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const QueryReturn = (props: ParamsPropsType) => {
  const [collectdata, setcollectdata] = useState(listParamsType);

  useEffect(() => {
    console.log(props.data);
    if (props.data !== null) {
      console.log(props);
      setcollectdata(props.data);
    } else {
      setcollectdata([
        ...collectdata,
        { key: "", value: "", formReturn: false },
      ]);
    }
  }, []);
  const add = () => {
    setcollectdata([...collectdata, { key: "", value: "", formReturn: false }]);
  };

  const formChange = (e: React.FormEvent<HTMLInputElement>, k: number) => {
    const evt = e.target as HTMLInputElement;
    const temp: any = [...collectdata];
    // temp[k][evt.name] = evt.value;

    const key = evt.name;
    const value = evt.value;

    temp[k][key] = value;
    setcollectdata(temp);
    props.returnBack(temp);
  };

  const formCheckboxChange = (
    e: React.FormEvent<HTMLInputElement>,
    k: number
  ) => {
    const evt = e.target as HTMLInputElement;
    const temp: any = [...collectdata];
    // temp[k][evt.name] = evt.value;

    const key = evt.name;
    const value = evt.checked;

    temp[k][key] = value;
    setcollectdata(temp);
    props.returnBack(temp);
  };

  const formTextareaChange = (
    e: React.FormEvent<HTMLTextAreaElement>,
    k: number
  ) => {
    const evt = e.target as HTMLTextAreaElement;
    const temp: any = [...collectdata];
    // temp[k][evt.name] = evt.value;

    const key = evt.name;
    const value = evt.value;

    temp[k][key] = value;
    setcollectdata(temp);
    props.returnBack(temp);
  };

  const remove = (k: number) => {
    const temp = [...collectdata];
    const filter = temp.filter((item, key) => key !== k);
    setcollectdata(filter);
    props.returnBack(filter);
  };
  return (
    <>
      <div className="">
        <div className="">
          <div className="flex justify-between">
            <div className="font-bold">Query Return(Only JSON)</div>
            <div>
              <button
                className="bg-red-600 text-white px-4 py-1 rounded-md my-1"
                onClick={add}
              >
                Add
              </button>
            </div>
          </div>
          <table className="">
            <thead>
              <tr className="border border-gray-200 py-2">
                <th className="border border-gray-200 py-2">Key</th>
                <th className="border border-gray-200 py-2">Value</th>
                <th className="border border-gray-200 py-2">Form Return</th>
                <th className="border border-gray-200 py-2">
                  <TrashIcon className="w-10 p-3 stroke-black" />
                </th>
              </tr>
            </thead>
            <tbody>
              {collectdata.map((data, k) => (
                <tr className="border border-gray-200 py-2">
                  <td className="border border-gray-200 py-2">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Key"
                      name="key"
                      value={data.key}
                      onChange={(e) => formChange(e, k)}
                    />
                  </td>
                  <td className="border border-gray-200 py-2 relative">
                    <textarea
                      className="form-textarea"
                      name="value"
                      placeholder="Leave blank"
                      value={data.value}
                      onChange={(e) => formTextareaChange(e, k)}
                    />
                  </td>
                  <td className="border border-gray-200 py-2 relative">
                    <label>
                      <input
                        type="checkbox"
                        className="form-input"
                        name="formReturn"
                        checked={data.formReturn}
                        defaultChecked={data.formReturn}
                        onChange={(e) => formCheckboxChange(e, k)}
                      />
                    </label>
                  </td>
                  <td>
                    <button className="" onClick={() => remove(k)}>
                      <TrashIcon className="w-10 p-3 bg-red-500 rounded-md stroke-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const Authorization = (props: ParamsPropsType) => {
  const [selectdata, setselectdata] = useState<string>("");
  const [collectdata, setcollectdata] = useState<authorizationDataType>({
    selectType: "",
    key: "",
    value: "",
    addTo: "",
    token: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    console.log(props);
    if (props.data !== null) {
      setcollectdata(props.data);
      setselectdata(props.data.selectType);
    }
  }, []);

  const changeAuthType = (e: React.FormEvent<HTMLSelectElement>) => {
    const evt = e.target as HTMLSelectElement;
    setselectdata(evt.value);
    setcollectdata({ ...collectdata, selectType: evt.value });
    props.returnBack({ ...collectdata, [evt.name]: evt.value });
  };

  const formChange = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setcollectdata({ ...collectdata, [evt.name]: evt.value });
    props.returnBack({ ...collectdata, [evt.name]: evt.value });
  };

  const formSelectChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const evt = e.target as HTMLSelectElement;
    setcollectdata({ ...collectdata, [evt.name]: evt.value });
    props.returnBack({ ...collectdata, [evt.name]: evt.value });
  };
  return (
    <>
      <div className="">
        <div className="font-bold py-2">Authorization</div>
        <div className="">
          <label className="form-label">Auth Type</label>
          <select
            className="form-select"
            name="type"
            onChange={changeAuthType}
            value={selectdata}
          >
            <option value={"no-auth"}>No Auth</option>
            <option value={"api-key"}>API Key</option>
            <option value={"bearer-token"}>Bearer Token</option>
            <option value={"basic-auth"}>Basic Auth</option>
          </select>
        </div>
        {selectdata === "api-key" ? (
          <>
            <div className="grid grid-cols-2 py-2">
              <div className="">
                <label className="form-label">Key</label>
              </div>
              <div className="">
                <input
                  className="form-input"
                  name="key"
                  placeholder="Key"
                  value={collectdata.key}
                  onChange={formChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="">
                <label className="form-label">Value</label>
              </div>
              <div className="">
                <input
                  className="form-input"
                  name="value"
                  placeholder="Value"
                  value={collectdata.value}
                  onChange={formChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="">
                <label className="form-label">Add To</label>
              </div>
              <div className="">
                <select
                  className="form-select"
                  name="addTo"
                  value={collectdata.addTo}
                  onChange={formSelectChange}
                >
                  <option value="header">Header</option>
                  <option value="query-params">Query Params</option>
                </select>
              </div>
            </div>
          </>
        ) : selectdata === "bearer-token" ? (
          <>
            <div className="grid grid-cols-2 py-2">
              <div className="">
                <label className="form-label">Token</label>
              </div>
              <div className="">
                <input
                  className="form-input"
                  name="token"
                  placeholder="Token"
                  value={collectdata.token}
                  onChange={formChange}
                />
              </div>
            </div>
          </>
        ) : selectdata === "basic-auth" ? (
          <>
            <div className="grid grid-cols-2 py-2">
              <div className="">
                <label className="form-label">Username</label>
              </div>
              <div className="">
                <input
                  className="form-input"
                  name="username"
                  placeholder="Username"
                  value={collectdata.username}
                  onChange={formChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="">
                <label className="form-label">Password</label>
              </div>
              <div className="">
                <input
                  className="form-input"
                  name="password"
                  placeholder="Password"
                  value={collectdata.password}
                  onChange={formChange}
                />
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

const Params = (props: ParamsPropsType) => {
  const [collectdata, setcollectdata] = useState(listParamsType);
  const [showagainsttrigger, setshowagainsttrigger] = useState<boolean>(false);
  const [atdata, steatdata] = useState({ data: null, key: 0 });

  useEffect(() => {
    setcollectdata(props.data);
  }, []);
  const add = () => {
    setcollectdata([...collectdata, { key: "", value: "" }]);
  };

  const formChange = (e: React.FormEvent<HTMLInputElement>, k: number) => {
    const evt = e.target as HTMLInputElement;
    const temp: any = [...collectdata];
    // temp[k][evt.name] = evt.value;

    const key = evt.name;
    const value = evt.value;

    temp[k][key] = value;
    setcollectdata(temp);
    props.returnBack(temp);
  };

  const remove = (k: number) => {
    const temp = [...collectdata];
    const filter = temp.filter((item, key) => key !== k);
    setcollectdata(filter);
    props.returnBack(filter);
  };

  const showat = (data: any, k: number) => {
    steatdata({ ...atdata, data: data, key: k });
    setshowagainsttrigger(true);
  };

  const againstTriggerReturn = (data: any) => {
    console;
    const temp: any = [...collectdata];
    // temp[k][evt.name] = evt.value;

    temp[atdata.key]["trigger"] = data;
    setcollectdata(temp);
    props.returnBack(temp);
    setshowagainsttrigger(false);
  };
  return (
    <>
      {showagainsttrigger ? (
        <AgainstTrigger data={atdata} returnBack={againstTriggerReturn} />
      ) : (
        ""
      )}
      <div className="">
        <div className="">
          <div className="flex justify-between">
            <div className="font-bold">Params</div>
            <div>
              <button
                className="bg-red-600 text-white px-4 py-1 rounded-md my-1"
                onClick={add}
              >
                Add
              </button>
            </div>
          </div>
          <table className="">
            <thead>
              <tr className="border border-gray-200 py-2">
                <th className="border border-gray-200 py-2">Key</th>
                <th className="border border-gray-200 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {collectdata.map((data, k) => (
                <tr className="border border-gray-200 py-2">
                  <td className="border border-gray-200 py-2">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Key"
                      name="key"
                      value={data.key}
                      onChange={(e) => formChange(e, k)}
                    />
                  </td>
                  <td className="border border-gray-200 py-2 relative">
                    <input
                      type="text"
                      className="form-input w-[70%]"
                      placeholder="Value"
                      name="value"
                      value={data.value}
                      onChange={(e) => formChange(e, k)}
                      // disabled={data.trigger?.switch}
                    />
                    <div
                      className={`absolute left-0 top-2 h-2 w-2  rounded-full ${
                        data.trigger?.switch ? "bg-red-500" : "bg-green-500"
                      }`}
                      onClick={() => {
                        showat(data.trigger, k);
                      }}
                    ></div>
                    <button
                      className="absolute top-2 right-3"
                      onClick={() => remove(k)}
                    >
                      <TrashIcon className="w-10 p-3 bg-red-500 rounded-md stroke-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const Headers = (props: ParamsPropsType) => {
  const [collectdata, setcollectdata] = useState(listParamsType);
  const [showagainsttrigger, setshowagainsttrigger] = useState<boolean>(false);
  const [atdata, steatdata] = useState({ data: null, key: 0 });

  useEffect(() => {
    if (props.data !== null) {
      setcollectdata(props.data);
    } else {
      setcollectdata([...collectdata, { key: "", value: "" }]);
    }
  }, []);
  const add = () => {
    setcollectdata([...collectdata, { key: "", value: "" }]);
  };

  const formChange = (e: React.FormEvent<HTMLInputElement>, k: number) => {
    const evt = e.target as HTMLInputElement;
    const temp: any = [...collectdata];
    // temp[k][evt.name] = evt.value;

    const key = evt.name;
    const value = evt.value;

    temp[k][key] = value;
    setcollectdata(temp);
    props.returnBack(temp);
  };

  const remove = (k: number) => {
    const temp = [...collectdata];
    const filter = temp.filter((item, key) => key !== k);
    setcollectdata(filter);
    props.returnBack(filter);
  };

  const showat = (data: any, k: number) => {
    steatdata({ ...atdata, data: data, key: k });
    setshowagainsttrigger(true);
  };

  const againstTriggerReturn = (data: any) => {
    console;
    const temp: any = [...collectdata];
    // temp[k][evt.name] = evt.value;

    temp[atdata.key]["trigger"] = data;
    setcollectdata(temp);
    props.returnBack(temp);
    setshowagainsttrigger(false);
  };
  return (
    <>
      {showagainsttrigger ? (
        <AgainstTrigger data={atdata} returnBack={againstTriggerReturn} />
      ) : (
        ""
      )}
      <div className="">
        <div className="">
          <div className="flex justify-between">
            <div className="font-bold">Headers</div>
            <div>
              <button
                className="bg-red-600 text-white px-4 py-1 rounded-md my-1"
                onClick={add}
              >
                Add
              </button>
            </div>
          </div>
          <table className="">
            <thead>
              <tr className="border border-gray-200 py-2">
                <th className="border border-gray-200 py-2">Key</th>
                <th className="border border-gray-200 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {collectdata !== null &&
                collectdata.map((data, k) => (
                  <tr className="border border-gray-200 py-2">
                    <td className="border border-gray-200 py-2">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Key"
                        name="key"
                        value={data.key}
                        onChange={(e) => formChange(e, k)}
                      />
                    </td>

                    <td className="border border-gray-200 py-2 relative">
                      <input
                        type="text"
                        className="form-input w-[70%]"
                        placeholder="Value"
                        name="value"
                        value={data.value}
                        onChange={(e) => formChange(e, k)}
                        // disabled={data.trigger?.switch}
                      />
                      <div
                        className={`absolute left-0 top-2 h-2 w-2  rounded-full ${
                          data.trigger?.switch ? "bg-red-500" : "bg-green-500"
                        }`}
                        onClick={() => {
                          showat(data.trigger, k);
                        }}
                      ></div>
                      <button
                        className="absolute top-2 right-3"
                        onClick={() => remove(k)}
                      >
                        <TrashIcon className="w-10 p-3 bg-red-500 rounded-md stroke-white" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const Body = (props: ParamsPropsType) => {
  const [collectdata, setcollectdata] = useState(listBodyType);
  const [collectdata1, setcollectdata1] = useState(listBodyType);
  const [alldata, setalldata] = useState<alldataType>({
    bodyType: "",
    bodyData: null,
  });

  useEffect(() => {
    if (props.data !== null) {
      setalldata({ ...alldata, bodyType: props.data.bodyType });
      if (props.data.bodyType === "form-data") {
        setcollectdata(props.data.bodyData);
      } else if (props.data.bodyType === "x-www-form-urlencoded") {
        setcollectdata1(props.data.bodyData);
      } else if (props.data.bodyType === "raw") {
        setalldata({ ...alldata, bodyData: props.data.bodyData });
      }
    }
  }, []);
  const add = () => {
    setcollectdata([...collectdata, { key: "", value: "" }]);
  };

  const formChange = (e: React.FormEvent<HTMLInputElement>, k: number) => {
    const evt = e.target as HTMLInputElement;
    const temp: any = [...collectdata];

    const key = evt.name;
    const value = evt.value;

    temp[k][key] = value;
    setcollectdata(temp);
    setalldata({ ...alldata, bodyData: temp });
    props.returnBack({ ...alldata, bodyData: temp });
  };

  const remove = (k: number) => {
    const temp = [...collectdata];
    const filter = temp.filter((item, key) => key !== k);
    setcollectdata(filter);
    setalldata({ ...alldata, bodyData: filter });
    props.returnBack({ ...alldata, bodyData: filter });
  };

  const add1 = () => {
    setcollectdata1([...collectdata1, { key: "", value: "" }]);
  };
  const formChange1 = (e: React.FormEvent<HTMLInputElement>, k: number) => {
    const evt = e.target as HTMLInputElement;
    const temp: any = [...collectdata];

    const key = evt.name;
    const value = evt.value;

    temp[k][key] = value;
    setcollectdata1(temp);
    setalldata({ ...alldata, bodyData: temp });
    props.returnBack({ ...alldata, bodyData: temp });
  };

  const remove1 = (k: number) => {
    const temp = [...collectdata1];
    const filter = temp.filter((item, key) => key !== k);
    setcollectdata1(filter);
    setalldata({ ...alldata, bodyData: filter });
    props.returnBack({ ...alldata, bodyData: filter });
  };

  const changeBodyType = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setalldata({ ...alldata, bodyType: evt.value });
    props.returnBack({ ...alldata, bodyType: evt.value });
  };
  const formTextareaChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const evt = e.target as HTMLTextAreaElement;
    setalldata({ ...alldata, bodyData: evt.value });
    props.returnBack({ ...alldata, bodyData: evt.value });
  };
  return (
    <>
      <div className="">
        <div className="">
          <div className="py-2 font-bold">Body</div>
          <div className="flex gap-x-3">
            <div className="flex items-center py-1">
              <input
                name="body"
                id="radio-none"
                type="radio"
                value="none"
                onChange={changeBodyType}
                checked={alldata.bodyType === "none"}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="radio-none"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                none
              </label>
            </div>
            <div className="flex items-center py-1">
              <input
                name="body"
                id="radio-form-data"
                type="radio"
                value="form-data"
                onChange={changeBodyType}
                checked={alldata.bodyType == "form-data"}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="radio-form-data"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                form-data
              </label>
            </div>
            <div className="flex items-center py-1">
              <input
                name="body"
                id="radio-x-www-form-urlencoded"
                type="radio"
                value="x-www-form-urlencoded"
                onChange={changeBodyType}
                checked={alldata.bodyType === "x-www-form-urlencoded"}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="radio-x-www-form-urlencoded"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                x-www-form-urlencoded
              </label>
            </div>
            <div className="flex items-center py-1">
              <input
                name="body"
                id="radio-raw"
                type="radio"
                value="raw"
                onChange={changeBodyType}
                checked={alldata.bodyType === "raw"}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="radio-raw"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                raw
              </label>
            </div>
          </div>
          {alldata.bodyType === "form-data" ? (
            <>
              <div className="flex justify-end">
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded-md my-1"
                  onClick={add}
                >
                  Add
                </button>
              </div>
              <table className="">
                <thead>
                  <tr className="border border-gray-200 py-2">
                    <th className="border border-gray-200 py-2">Key</th>
                    <th className="border border-gray-200 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {collectdata.map((data, k) => (
                    <tr className="border border-gray-200 py-2">
                      <td className="border border-gray-200 py-2">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Key"
                          name="key"
                          value={data.key}
                          onChange={(e) => formChange(e, k)}
                        />
                      </td>
                      <td className="border border-gray-200 py-2 relative">
                        <input
                          type="text"
                          className="form-input w-[70%]"
                          placeholder="Value"
                          name="value"
                          value={data.value}
                          onChange={(e) => formChange(e, k)}
                        />
                        <button
                          className="absolute top-2 right-3"
                          onClick={() => remove(k)}
                        >
                          <TrashIcon className="w-10 p-3 bg-red-500 rounded-md stroke-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : alldata.bodyType === "x-www-form-urlencoded" ? (
            <>
              <div className="flex justify-end">
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded-md my-1"
                  onClick={add1}
                >
                  Add
                </button>
              </div>
              <table className="">
                <thead>
                  <tr className="border border-gray-200 py-2">
                    <th className="border border-gray-200 py-2">Key</th>
                    <th className="border border-gray-200 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {collectdata1.map((data, k) => (
                    <tr className="border border-gray-200 py-2">
                      <td className="border border-gray-200 py-2">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Key"
                          name="key"
                          value={data.key}
                          onChange={(e) => formChange1(e, k)}
                        />
                      </td>
                      <td className="border border-gray-200 py-2 relative">
                        <input
                          type="text"
                          className="form-input w-[70%]"
                          placeholder="Value"
                          name="value"
                          value={data.value}
                          onChange={(e) => formChange1(e, k)}
                        />
                        <button
                          className="absolute top-2 right-3"
                          onClick={() => remove1(k)}
                        >
                          <TrashIcon className="w-10 p-3 bg-red-500 rounded-md stroke-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            ""
          )}
          {alldata.bodyType === "raw" ? (
            <textarea
              className="w-full form-textarea"
              rows={7}
              onChange={formTextareaChange}
              value={alldata.bodyData}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default AddEdit;
