"use client";

import { Printer } from "lucide-react";

export default function PrintInvoiceButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-widest text-xs transition-colors rounded-xl flex items-center gap-2 shadow-sm print:hidden"
    >
      <Printer size={16} /> Print / Save PDF
    </button>
  );
}
