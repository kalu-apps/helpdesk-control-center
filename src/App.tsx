import { useEffect, useState } from "react";
import { useTicketStore } from "./store/useTicketStore";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Catalog from "./components/Catalog";
import Spinner from "./components/ui/Spinner";

export default function App() {
  const initTickets = useTicketStore((state) => state.initTickets);
  const isLoading = useTicketStore((state) => state.isLoading);
  const [activeTab, setActiveTab] = useState<"dashboard" | "catalog">(
    "dashboard",
  );

  useEffect(() => {
    // Запускаем асинхронную генерацию 100 000 строк 
    initTickets(100000);
  }, [initTickets]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f6fa] flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 max-w-sm w-full text-center shadow-sm">
          <Spinner message="Инициализация реестра..." />
        </div>
      </div>
    );
  }


  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "dashboard" ? <Dashboard /> : <Catalog />}
    </Layout>
  );
}
