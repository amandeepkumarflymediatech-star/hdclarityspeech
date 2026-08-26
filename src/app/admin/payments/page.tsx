import React from 'react';
import { prisma } from '@/lib/db';
import { Banknote, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const orders = await prisma.order.findMany({
    include: {
      student: { select: { name: true, email: true } },
      package: { select: { name: true } },
      coupon: { select: { code: true } },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalRevenue = orders
    .filter((o) => o.status === 'PAID')
    .reduce((sum, order) => sum + order.amount, 0);

  const pendingPayments = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-primary font-playfair mb-2">Payments & Orders</h1>
        <p className="text-primary/60 text-sm">Monitor platform revenue and student transactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border-l-4 border-green-500 shadow-sm rounded-r-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black text-primary">₹{totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 border-l-4 border-orange-500 shadow-sm rounded-r-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">Pending Orders</p>
            <h3 className="text-3xl font-black text-primary">{pendingPayments}</h3>
          </div>
          <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-secondary overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary bg-secondary/20 flex items-center gap-2">
          <Banknote className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-primary">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10">
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Item</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-primary/40 font-bold italic">No transactions found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-secondary/50 hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4">
                      {order.payment?.razorpayOrderId ? (
                        <span className="font-mono text-xs text-primary/70">{order.payment.razorpayOrderId}</span>
                      ) : (
                        <span className="text-xs text-primary/40 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      {order.student.name}
                      <span className="block text-xs font-normal text-primary/50">{order.student.email}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary/80">
                      {order.package ? order.package.name : 'Single Session'}
                      {order.coupon && (
                        <span className="block text-xs font-bold text-accent mt-0.5">Code: {order.coupon.code}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-black">
                      ₹{order.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center w-fit gap-1 px-2 py-1 rounded-md text-xs font-bold ${
                        order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                        order.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {order.status === 'PAID' && <CheckCircle2 size={12} />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-primary/70">{format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
