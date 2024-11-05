export type triggerType = {
  _id?: string;
  triggerId: number;
  triggerName: string;
  type: string;
  url: string;
  params: boolean;
  queryReturn: any;
  paramsData: any;
  authorization: boolean;
  authorizationData: any;
  headers: boolean;
  headersData: any;
  body: boolean;
  bodyData: any;
  externalLink: string;
  internalLink: string;
};

export type paramsType = {
  key: string;
  value: string;
  trigger?: againstTriggerType;
  formReturn?: boolean;
};

export const listParamsType: paramsType[] = [];

export type headerType = {
  key: string;
  value: string;
  trigger?: againstTriggerType;
};

export const listHeadersType: headerType[] = [];

export type bodyType = {
  key: string;
  value: string;
  trigger?: againstTriggerType;
};

export type alldataType = {
  bodyType: string;
  bodyData: any;
};

export const listBodyType: bodyType[] = [];

export type authorizationDataType = {
  selectType: string;
  key: string;
  value: string;
  trigger?: againstTriggerType;
  addTo: string;
  token: string;
  tokenTrigger?: againstTriggerType;
  username: string;
  usernameTrigger?: againstTriggerType;
  password: string;
  passwordTrigger?: againstTriggerType;
};

export type ParamsPropsType = {
  returnBack: Function;
  data: any;
};

export type againstTriggerType = {
  switch: boolean;
  selected: number | null;
  querySelected: number | null;
};

export type againsttriggerType = {
  triggerId: number;
  triggerName: string;
  queryReturn: any;
};

export const againstTriggerListType: againsttriggerType[] = [];
