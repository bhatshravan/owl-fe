import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "./endpoints";

export const API = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  // baseURL: "http://localhost:8080",
  baseURL: "https://owlbe.bitstreak.in",
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
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Auth");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common.Authorization;
    }
    return config;
  },

  (error) => Promise.reject(error)
);

export async function fetchData(method: any, url: any, data: any) {
  const { data: apiData } = await API({
    method: method,
    url: url,
    data: data,
  });
  return apiData;
}

// export function useLocalCall(
//   query: any,
//   method: any,
//   url: any,
//   dataInput: any = {}
// ) {
//   return useQuery(query, () => {
//     const { data } = await API({
//       method,
//       url,
//       data: dataInput,
//     });
//     return data;
//   });
// }
// export function useApiCall(
//   query: any,
//   method: any,
//   url: any,
//   dataInput: any = {},
//   options: any = {}
// ) {
//   return useQuery(
//     query,
//     async () => {
//       const { data } = await API({
//         method,
//         url,
//         data: dataInput,
//       });
//       return data;
//     },
//   );
// }

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

export const useQueryCall = (
  query: any,
  method: any,
  url: keyof typeof ENDPOINTS,
  dataInput: any = {},
  options: any = {}
) => {
  return useQuery({
    queryKey: query,
    queryFn: ():any => {
      const endpoint = ENDPOINTS[url];
      return API({
        method,
        url: endpoint as string,
        data: dataInput,
      });
    },
    ...options,
  });
};
