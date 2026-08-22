import { CreditCard, Check, Shield, Zap } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RazorpayCheckoutButton from "@/components/student/RazorpayCheckoutButton";

export default async function StudentSubscriptionsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Changed to StudentPackage as per schema
  const activePackage = await prisma.studentPackage.findFirst({
    where: { studentId: session.user.id },
    include: { package: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Subscription</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage your plan and billing details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {!activePackage ? (
            <div className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center text-primary/40 mb-4">
                <CreditCard size={24} />
              </div>
              <h2 className="text-2xl font-black text-primary font-playfair mb-2">No Active Subscription</h2>
              <p className="text-primary/60 font-sans text-sm mb-6 max-w-sm">You currently do not have an active subscription plan. Upgrade to unlock all features.</p>
            </div>
          ) : (
            <div className="bg-white border border-accent/20 p-8 rounded-3xl shadow-lg shadow-accent/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent text-white px-6 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl shadow-sm">
                Current Plan
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div>
                  <h2 className="text-2xl font-black text-primary font-playfair flex items-center gap-2 mb-2">
                    <Shield className="text-accent" /> {activePackage.package.name} Plan
                  </h2>
                  <p className="text-primary/70 font-sans text-sm">Status: <span className="font-bold text-accent">{activePackage.status}</span>. Subscribed on {new Date(activePackage.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.</p>
                  <p className="text-primary/70 font-sans text-sm mt-1">Sessions Remaining: <span className="font-bold">{activePackage.remainingSessions} / {activePackage.totalSessions}</span></p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-4xl font-black text-primary font-playfair tracking-tight">
                    ${activePackage.package.price}<span className="text-lg text-primary/50 font-sans"></span>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-secondary/30 flex gap-4">
                <button className="px-6 py-3 bg-secondary/10 border border-secondary/50 text-primary font-bold uppercase tracking-widest text-xs hover:bg-secondary/30 hover:border-secondary transition-all rounded-xl">
                  Cancel Plan
                </button>
                <button className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-sm rounded-xl">
                  Upgrade
                </button>
              </div>
            </div>
          )}

          <div className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight mb-6">Billing History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-secondary/30 text-[10px] font-bold text-primary/50 uppercase tracking-widest">
                    <th className="pb-4 pr-4">Date</th>
                    <th className="pb-4 px-4">Amount</th>
                    <th className="pb-4 px-4">Status</th>
                    <th className="pb-4 pl-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-secondary/20 hover:bg-secondary/5 transition-colors group">
                    <td className="py-4 pr-4 font-bold text-primary rounded-l-xl">Oct 12, 2024</td>
                    <td className="py-4 px-4 text-primary/80">$49.00</td>
                    <td className="py-4 px-4"><span className="text-[10px] font-bold bg-green-100/50 text-green-700 px-3 py-1 rounded-full uppercase tracking-widest border border-green-200">Paid</span></td>
                    <td className="py-4 pl-4 text-right rounded-r-xl"><a href="#" className="text-accent font-bold hover:underline">Download</a></td>
                  </tr>
                  <tr className="border-b border-secondary/20 hover:bg-secondary/5 transition-colors group">
                    <td className="py-4 pr-4 font-bold text-primary rounded-l-xl">Sep 12, 2024</td>
                    <td className="py-4 px-4 text-primary/80">$49.00</td>
                    <td className="py-4 px-4"><span className="text-[10px] font-bold bg-green-100/50 text-green-700 px-3 py-1 rounded-full uppercase tracking-widest border border-green-200">Paid</span></td>
                    <td className="py-4 pl-4 text-right rounded-r-xl"><a href="#" className="text-accent font-bold hover:underline">Download</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-primary to-primary/90 text-white p-8 relative overflow-hidden shadow-xl shadow-primary/10 rounded-3xl border border-primary-light/10 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <Zap className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 group-hover:scale-110 group-hover:text-accent/20 transition-all duration-700" />
            
            <div className="inline-block px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-[10px] font-bold mb-6 uppercase tracking-widest backdrop-blur-md relative z-10">Premium</div>
            
            <h3 className="text-3xl font-black mb-4 font-playfair tracking-tight relative z-10">Why Pro?</h3>
            <ul className="space-y-4 mb-8 relative z-10 font-sans text-sm text-white/80">
              <li className="flex items-start gap-3">
                <div className="p-1 bg-accent/20 rounded-full shrink-0">
                  <Check size={12} className="text-accent" />
                </div>
                <span>Unlimited therapy sessions per month.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 bg-accent/20 rounded-full shrink-0">
                  <Check size={12} className="text-accent" />
                </div>
                <span>Priority booking with top tutors.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 bg-accent/20 rounded-full shrink-0">
                  <Check size={12} className="text-accent" />
                </div>
                <span>Access to exclusive practice materials.</span>
              </li>
            </ul>
            <RazorpayCheckoutButton amount={99} packageId="pro-plan-1" label="Upgrade to Pro - $99" />
          </div>
        </div>
      </div>
    </div>
  );
}
