import "./App.css";
import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { QueryClient } from "react-query";
import { useQueryCall } from "./Utils/api";
import { Spinner } from "./components/ui/spinner";
import { useEffect } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

// Pages
import News from "./pages/News";
import Login from "./pages/Login";
import Positions from "./pages/Positions";
import Dashboard from "./pages/Dashboard";
import LiveLTP from "./pages/LiveLTP";
import Holdings from "./pages/Holdings";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
// import Settings from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnWindowFocus: true,
      retry: 0,
      staleTime: 0,
      cacheTime: 0,
      keepPreviousData: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="owl-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </ThemeProvider>
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
      staleTime: 300000,
      cacheTime: 600000,
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
      <div className="flex items-center justify-center min-h-screen bg-background">
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

  return <LoggedInRoutes />;
};

const LoggedInRoutes = () => (
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1" />
      </header>
      <main className="flex-1 overflow-auto p-4 lg:p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/live" element={<LiveLTP />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/news" element={<News />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </SidebarInset>
  </SidebarProvider>
);

export default App;
