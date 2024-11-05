export type formDataType = {
  _id?: string;
  triggerId?: string;
  formName: string;
  formData: [formType] | null;
};

export type formType = {
  type: string; // text,number,password,radio,checkbox
  title: string;
  name: string;
  default: string;
  label: string;
  placeholder: string;
  required: boolean;
};

export const listFormType: formType[] = [];
