import axios from "axios";
const create = axios.create();
import { serverURL } from "../stuff";
import { triggerType } from "../types/trigger";

export const createTrigger = async (data: triggerType) => {
  return create.post(serverURL + "/api/create-trigger", data);
};

export const getTrigger = async (id: string) => {
  return create.get(serverURL + "/api/get-trigger/" + id);
};

export const updateTrigger = async (data: triggerType) => {
  return create.post(serverURL + "/api/update-trigger", data);
};

export const getTriggerList = async () => {
  return create.get(serverURL + "/api/get-trigger-list");
};
