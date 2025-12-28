"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar"; 
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        
        
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between shrink-0">
          <span className="text-xl font-serif font-bold">Esmae Admin</span>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </header>

        
        <main className="flex-1 overflow-auto p-4 md:p-8">
           {children}
        </main>

      </div>
    </div>
  );
}