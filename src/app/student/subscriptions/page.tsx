import { CreditCard, Check, Shield, Zap } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentSubscriptionsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const subscription = await prisma.subscription.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Subscription</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage your plan and billing details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {!subscription ? (
            <div className="bg-white border-2 border-secondary p-8 shadow-sm relative overflow-hidden">
              <h2 className="text-2xl font-black text-primary font-playfair mb-2">No Active Subscription</h2>
              <p className="text-primary/70 font-sans text-sm mb-6">You currently do not have an active subscription plan.</p>
            </div>
          ) : (
            <div className="bg-white border-2 border-accent p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent text-white px-4 py-1 text-xs font-bold uppercase tracking-widest">
                Current Plan
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div>
                  <h2 className="text-2xl font-black text-primary font-playfair flex items-center gap-2 mb-2">
                    <Shield className="text-accent" /> {subscription.planType} Plan
                  </h2>
                  <p className="text-primary/70 font-sans text-sm">Status: <span className="font-bold">{subscription.status}</span>. Subscribed on {new Date(subscription.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-4xl font-black text-primary font-playfair tracking-tight">
                    {subscription.planType === 'PREMIUM' ? '$49' : (subscription.planType === 'BASIC' ? '$19' : '$99')}<span className="text-lg text-primary/50 font-sans">/mo</span>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-secondary flex gap-4">
                <button className="px-6 py-3 bg-white border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors">
                  Cancel Plan
                </button>
                <button className="px-6 py-3 bg-accent hover:bg-primary text-white font-bold uppercase tracking-widest text-xs transition-colors shadow-sm">
                  Upgrade
                </button>
              </div>
            </div>
          )}

          <div className="bg-white border border-secondary p-8 shadow-sm">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight mb-6">Billing History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-secondary text-xs font-bold text-primary/50 uppercase tracking-widest">
                    <th className="pb-4 pr-4">Date</th>
                    <th className="pb-4 px-4">Amount</th>
                    <th className="pb-4 px-4">Status</th>
                    <th className="pb-4 pl-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-secondary/50">
                    <td className="py-4 pr-4 font-bold text-primary">Oct 12, 2024</td>
                    <td className="py-4 px-4 text-primary/80">$49.00</td>
                    <td className="py-4 px-4"><span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 uppercase tracking-widest">Paid</span></td>
                    <td className="py-4 pl-4 text-right"><a href="#" className="text-accent font-bold hover:underline">Download</a></td>
                  </tr>
                  <tr className="border-b border-secondary/50">
                    <td className="py-4 pr-4 font-bold text-primary">Sep 12, 2024</td>
                    <td className="py-4 px-4 text-primary/80">$49.00</td>
                    <td className="py-4 px-4"><span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 uppercase tracking-widest">Paid</span></td>
                    <td className="py-4 pl-4 text-right"><a href="#" className="text-accent font-bold hover:underline">Download</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-primary text-white p-8 relative overflow-hidden shadow-lg border-l-4 border-accent">
            <Zap className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5" />
            <h3 className="text-xl font-black mb-4 font-playfair tracking-tight relative z-10">Why Pro?</h3>
            <ul className="space-y-4 mb-8 relative z-10 font-sans text-sm text-white/80">
              <li className="flex items-start gap-3">
                <Check size={16} className="text-accent shrink-0 mt-0.5" />
                <span>Unlimited therapy sessions per month.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="text-accent shrink-0 mt-0.5" />
                <span>Priority booking with top tutors.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="text-accent shrink-0 mt-0.5" />
                <span>Access to exclusive practice materials.</span>
              </li>
            </ul>
            <button className="w-full py-4 bg-white text-primary hover:bg-accent hover:text-white font-bold uppercase tracking-widest text-xs transition-colors relative z-10 rounded-none">
              Upgrade to Pro - $99/mo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
