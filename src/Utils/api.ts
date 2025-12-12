import axios from "axios";

import { useQuery } from "react-query";


export const API = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  // baseURL: "http://localhost:8080",
  baseURL: "https://trade.bitstreak.in",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response ? error.response.status : null;

//     if (status === 401) {
//       localStorage.removeItem("Auth");
//       localStorage.removeItem("Profile");
//       window.location.href = "/signin";
//     }

//     return Promise.reject(error);
//   }
// );
// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("Auth");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       delete API.defaults.headers.common.Authorization;
//     }
//     return config;
//   },

//   (error) => Promise.reject(error)
// );

export async function fetchData(method: any, url: any, data: any) {
  const { data: apiData } = await API({
    method: method,
    url: url,
    data: data,
  });
  return apiData;
}

export function useLocalCall(query: any, method: any, url: any, dataInput: any = {}) {
  return useQuery(
    query,
    async () => {
      const { data } = await API({
        method,
        url,
        data: dataInput,
      });
      return data;
    }
  );
}
export function useApiCall(query: any, method: any, url: any, dataInput: any = {}, options: any = {}) {
  return useQuery(
    query,
    async () => {
      const { data } = await API({
        method,
        url,
        data: dataInput,
      });
      return data;
    },
    options
  );
}

export async function runAxios(method: any, url: any, data: any) {
  const resp = await API({
  method: method,
  url: url,
  data: data,
  headers: { Authorization: `Bearer ${localStorage.getItem("Auth")}` },
})
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return { status: "error" };
    });
  return resp;
}
