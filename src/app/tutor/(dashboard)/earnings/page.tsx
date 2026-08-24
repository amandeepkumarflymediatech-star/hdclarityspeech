import { Wallet, TrendingUp, Download, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RequestPayoutButton from "./_components/RequestPayoutButton";

export default async function TutorEarningsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "TUTOR") {
    redirect("/login");
  }

  // Fetch earnings data
  const earnings = await prisma.tutorEarning.findMany({
    where: { tutorId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  const payouts = await prisma.tutorPayout.findMany({
    where: { tutorId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  // Calculate totals
  const totalEarned = earnings.reduce((acc, curr) => acc + curr.netEarning, 0);
  const pendingAmount = earnings
    .filter(e => e.status === "PENDING" || e.status === "AVAILABLE_FOR_PAYOUT")
    .reduce((acc, curr) => acc + curr.netEarning, 0);

  const availableForPayout = earnings
    .filter(e => e.status === "AVAILABLE_FOR_PAYOUT")
    .reduce((acc, curr) => acc + curr.netEarning, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-sm font-sans flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span> Finances
          </h4>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Earnings & Payouts</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Track your income and request withdrawals.</p>
        </div>
        <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider text-sm transition-all rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1">
          <Download size={18} />
          Export Statement
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Available for Payout Card */}
        <div className="bg-gradient-to-br from-accent to-accent/80 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-accent/10 group">
          <div className="absolute -top-10 -right-10 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
            <Wallet size={180} className="-rotate-12 transform translate-x-8 -translate-y-8" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/20 text-white border border-white/20 rounded-full text-[10px] font-bold mb-6 uppercase tracking-widest backdrop-blur-md">Available to withdraw</span>
              <h3 className="text-5xl font-black mb-2 font-playfair tracking-tight">${pendingAmount.toFixed(2)}</h3>
              <p className="text-white/80 text-sm font-sans">Pending processing by platform</p>
            </div>
            <div className="mt-8">
              <RequestPayoutButton disabled={availableForPayout <= 0} />
            </div>
          </div>
        </div>

        {/* Total Lifetime Earnings */}
        <div className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-primary/50 text-[10px] font-bold uppercase tracking-widest mb-1">Lifetime Earnings</h3>
              <h2 className="text-4xl font-black text-primary font-playfair tracking-tight">${totalEarned.toFixed(2)}</h2>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 border border-green-200">
              <TrendingUp size={24} />
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
             <div className="p-4 bg-secondary/10 rounded-2xl flex justify-between items-center border border-secondary/20">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary/50 shadow-sm">
                   <Clock size={16} />
                 </div>
                 <span className="text-sm font-bold text-primary">Last Payout</span>
               </div>
               <span className="text-sm font-bold text-accent">
                 {payouts.length > 0 ? `$${payouts[0].amount.toFixed(2)}` : 'None yet'}
               </span>
             </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Payouts */}
        <div className="lg:col-span-1 bg-white border border-secondary/30 p-6 rounded-3xl shadow-sm">
          <h3 className="text-lg font-black text-primary font-playfair tracking-tight border-b border-secondary/30 pb-4 mb-4">Recent Payouts</h3>
          <div className="space-y-3">
            {payouts.length === 0 ? (
              <p className="text-sm text-primary/50 text-center py-4">No payouts requested yet.</p>
            ) : (
              payouts.map((payout) => (
                <div key={payout.id} className="p-4 bg-secondary/5 rounded-2xl flex items-center justify-between group hover:bg-secondary/10 transition-colors border border-transparent hover:border-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm border border-secondary/20">
                      <ArrowUpRight size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">${payout.amount.toFixed(2)}</p>
                      <p className="text-[10px] text-primary/50 uppercase tracking-widest">{new Date(payout.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest ${
                    payout.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                    payout.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {payout.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detailed Earnings Ledger */}
        <div className="lg:col-span-2 bg-white border border-secondary/30 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-secondary/30 flex justify-between items-center bg-white/50 backdrop-blur-sm">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Earning Ledger</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-secondary/30 text-[10px] font-bold text-primary/50 uppercase tracking-widest bg-secondary/5">
                  <th className="py-4 pl-6 pr-4">Date</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Platform Fee</th>
                  <th className="py-4 px-4">Net Earning</th>
                  <th className="py-4 pr-6 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {earnings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-primary/50">No earnings recorded yet. Complete a session!</td>
                  </tr>
                ) : (
                  earnings.map((earning) => (
                    <tr key={earning.id} className="border-b border-secondary/20 hover:bg-secondary/5 transition-colors">
                      <td className="py-4 pl-6 pr-4 font-bold text-primary">{new Date(earning.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-primary/70">${earning.amount.toFixed(2)}</td>
                      <td className="py-4 px-4 text-red-400">-${earning.platformFee.toFixed(2)}</td>
                      <td className="py-4 px-4 font-bold text-green-600">+${earning.netEarning.toFixed(2)}</td>
                      <td className="py-4 pr-6 pl-4 text-right">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest ${
                          earning.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {earning.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
