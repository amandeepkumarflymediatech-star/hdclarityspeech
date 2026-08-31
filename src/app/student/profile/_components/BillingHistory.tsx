import React from "react";
import { Receipt, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function BillingHistory({ orders }: { orders: any[] }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white border border-secondary/20 p-8 sm:p-10 rounded-3xl shadow-xl shadow-primary/5 mt-12 mb-12">
        <h3 className="text-2xl font-black text-primary font-playfair mb-2">Billing History</h3>
        <p className="text-primary/60 text-sm mb-6">View your past purchases and billing statements.</p>
        <div className="text-center py-10 bg-secondary/5 rounded-2xl border border-secondary/20">
          <Receipt className="mx-auto h-10 w-10 text-primary/30 mb-3" />
          <p className="text-primary/60 font-medium">No billing history found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-secondary/20 p-8 sm:p-10 rounded-3xl shadow-xl shadow-primary/5 mt-12 mb-12">
      <h3 className="text-2xl font-black text-primary font-playfair mb-2">Billing History</h3>
      <p className="text-primary/60 text-sm mb-8">View your past purchases and billing statements.</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-secondary/30 bg-secondary/5 text-xs font-bold text-primary/50 uppercase tracking-widest">
              <th className="p-4 rounded-tl-xl">Date</th>
              <th className="p-4">Package</th>
              <th className="p-4">Amount</th>
              <th className="p-4 rounded-tr-xl">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-secondary/20 last:border-0 hover:bg-secondary/5 transition-colors">
                <td className="p-4 text-sm font-medium text-primary">
                  {format(new Date(order.createdAt), "MMM dd, yyyy")}
                </td>
                <td className="p-4 text-sm font-bold text-primary">
                  {order.package?.name || order.booking?.sessionType?.name || "Purchase"}
                </td>
                <td className="p-4 text-sm font-medium text-primary">
                  ${order.amount.toFixed(2)}
                </td>
                <td className="p-4">
                  {order.status === "PAID" ? (
                    <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-green-700 bg-green-100 px-2 py-1 rounded-md w-fit">
                      <CheckCircle size={12} /> Paid
                    </span>
                  ) : order.status === "PENDING" ? (
                    <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-1 rounded-md w-fit">
                      <Clock size={12} /> Pending
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-red-700 bg-red-100 px-2 py-1 rounded-md w-fit">
                      <XCircle size={12} /> {order.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
