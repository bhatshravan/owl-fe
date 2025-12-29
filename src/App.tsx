import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import News from "./pages/News";
import Login from "./pages/Login";
import { QueryClientProvider } from "react-query";
import { QueryClient } from "react-query";
import { useQueryCall } from "./Utils/api";
import { Spinner } from "./components/ui/spinner";
import React, { useEffect } from "react";
import Positions from "./pages/Positions";
import { Shoonya } from "./pages/Shoonya";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnWindowFocus: true,
      retry: 0,
      staleTime: 0, // 5 minutes
      cacheTime: 0, // 10 minutes
      keepPreviousData: false,
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}

const AppRoutes = () => {
  const isAuthTokenPresent = !!localStorage.getItem("Auth");

  const getInstruments = useQueryCall(
    "instruments",
    "get",
    "INSTRUMENTS",
    {},
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 0,
      staleTime: 300000, // 5 minutes
      cacheTime: 600000, // 10 minutes
      keepPreviousData: false,
      enabled: isAuthTokenPresent,
    }
  );

  useEffect(() => {
    if (getInstruments.isError) {
      localStorage.removeItem("Auth");
      window.location.href = "/signin";
    }
  }, [getInstruments.isError]);

  if (getInstruments.isLoading) {
    return (
      <div
        className="flex items-center justify-center flex-1"
        style={{
          height: "100vh",
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (!isAuthTokenPresent) {
    return (
      <Routes>
        <Route path="/*" element={<Login />} />
      </Routes>
    );
  }
  return (
    <>
      <LoggedInRoutes />
    </>
  );
};

const LoggedInRoutes = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
    }}
  >
    <Navbar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/news" element={<News />} />
      <Route path="/positions" element={<Positions />} />
      <Route path="/shoonya" element={<Shoonya />} />
      <Route path="/2" element={<Shoonya />} />
    </Routes>
  </div>
);

export default App;
