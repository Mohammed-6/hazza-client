import axios from "axios";
import { useEffect } from "react";
export const baseUrl = "https://hazza-server.exllab.in/api";

export const postRequest = async (url: string, body: any) => {
  return await axios
    .post(url, body, {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      return { error: false, response };
    })
    .catch((error) => {
      return { error: true, message: error?.response?.data };
    });
};

export const getRequest = async (url: string) => {
  return await axios
    .get(url)
    .then((response) => {
      return { error: false, response };
    })
    .catch((error) => {
      return { error: true, message: error?.response?.data };
    });
};

export function makeid(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Function to convert an object to table rows
export function objectToTable(data: any) {
  // useEffect(() => {
  //   // const json = JSON.parse(data);
  //   try {
  //     return JSON.parse(data);
  //   } catch (error) {
  //     return "error in object!";
  //   }
  // }, []);
  return (
    <table>
      <thead>
        <tr className="border border-gray-200 px-1 py-2">
          <th className="border border-gray-200 px-1 py-2">Key</th>
          <th className="border border-gray-200 px-1 py-2">Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([key, value]: any) => (
          <tr key={key} className="border border-gray-200 px-1 py-2">
            <td className="border border-gray-200 px-1 py-2">{key}</td>
            <td className="border border-gray-200 px-1 py-2">
              {value.toString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
