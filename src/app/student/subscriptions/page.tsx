import { CreditCard, Check, Shield, Zap } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import RazorpayCheckoutButton from "@/components/student/RazorpayCheckoutButton";

export default async function StudentSubscriptionsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const myPackages = await prisma.studentPackage.findMany({
    where: { studentId: session.user.id, status: { in: ['ACTIVE', 'DEPLETED'] } },
    include: { package: true },
    orderBy: { createdAt: 'desc' }
  });

  const orders = await prisma.order.findMany({
    where: { studentId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' }
  });

  const standaloneSession = await prisma.sessionType.findFirst({
    where: { name: '1 Hour Session', isActive: true }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Subscription</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage your plan and billing details.</p>
        </div>
      </div>

      <div className="space-y-12">
        <div className="space-y-8">
          {myPackages.length === 0 ? (
            <div className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center text-primary/40 mb-4">
                <CreditCard size={24} />
              </div>
              <h2 className="text-2xl font-black text-primary font-playfair mb-2">No Active Subscription</h2>
              <p className="text-primary/60 font-sans text-sm mb-6 max-w-sm">You currently do not have an active subscription plan. Upgrade to unlock all features.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myPackages.map((pkg) => {
                const isDepleted = pkg.remainingSessions <= 0 || pkg.status === 'DEPLETED';
                
                if (isDepleted) {
                  return (
                    <div key={pkg.id} className="bg-secondary/5 border border-secondary/20 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 opacity-75 grayscale-[20%]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center text-primary/40 shrink-0">
                          <Shield size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-primary/70 font-playfair mb-1">
                            {pkg.package.name} <span className="text-xs font-sans text-primary/50 ml-2 uppercase tracking-widest">(Depleted)</span>
                          </h2>
                          <p className="text-primary/50 font-sans text-xs">Used all credits by {new Date(pkg.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="text-left md:text-right flex-1 md:flex-none">
                          <p className="text-primary/40 text-xs font-bold uppercase tracking-widest mb-1">Remaining</p>
                          <p className="font-bold text-primary/40 text-xl">{pkg.remainingSessions} <span className="text-sm">/ {pkg.totalSessions}</span></p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={pkg.id} className="bg-white border border-accent/20 p-5 rounded-2xl shadow-sm hover:shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="absolute top-0 right-0 bg-accent text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-bl-xl shadow-sm">
                      Active
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                        <Shield size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-primary font-playfair mb-1">
                          {pkg.package.name}
                        </h2>
                        <p className="text-primary/60 font-sans text-xs">Subscribed on {new Date(pkg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="text-left md:text-right flex-1 md:flex-none">
                        <p className="text-primary/50 text-xs font-bold uppercase tracking-widest mb-1">Remaining</p>
                        <p className="font-bold text-accent text-xl">{pkg.remainingSessions} <span className="text-sm text-primary/40">/ {pkg.totalSessions}</span></p>
                      </div>
                      <div className="text-right hidden md:block">
                        <p className="text-primary/50 text-xs font-bold uppercase tracking-widest mb-1">Price</p>
                        <p className="text-xl font-black text-primary">${pkg.package.price}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Available Plans Section */}
        <div className="pt-8 border-t border-secondary/30">
          <h2 className="text-3xl font-black text-primary font-playfair tracking-tight mb-8">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Standalone Class */}
            {standaloneSession && (
              <div className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <h3 className="text-xl font-black text-primary font-playfair mb-2">{standaloneSession.name}</h3>
                <p className="text-4xl font-black text-primary font-playfair tracking-tight mb-4">${standaloneSession.basePrice}</p>
                <p className="text-primary/70 font-sans text-sm mb-8 flex-1">{standaloneSession.description}</p>
                <RazorpayCheckoutButton amount={standaloneSession.basePrice} packageId={standaloneSession.id} label="Buy Single Class" />
              </div>
            )}

            {/* Packages */}
            {packages.map((pkg) => {
              const isPopular = pkg.isPopular;
              const perClass = pkg.totalSessions > 0 ? Math.round(pkg.price / pkg.totalSessions) : pkg.price;
              
              return (
                <div key={pkg.id} className={isPopular
                  ? "bg-gradient-to-br from-primary to-primary/90 text-white p-8 rounded-3xl shadow-xl border border-primary-light/10 relative overflow-hidden flex flex-col transform md:scale-105 z-10 hover:-translate-y-1 transition-all duration-300 mt-4 md:mt-0"
                  : "bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
                }>
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-accent text-white px-4 py-1 text-[8px] font-bold uppercase tracking-widest rounded-bl-xl shadow-sm">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className={`text-xl font-black font-playfair mb-2 ${isPopular ? "mt-2" : "text-primary"}`}>{pkg.name}</h3>
                  <p className={`text-4xl font-black font-playfair tracking-tight mb-1 ${!isPopular && 'text-primary'}`}>
                    ${pkg.price}<span className={`text-lg font-sans ${isPopular ? 'text-white/50' : 'text-primary/50'}`}>/mo</span>
                  </p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isPopular ? 'text-accent-light' : 'text-accent'}`}>
                    ${perClass} per class
                  </p>
                  <p className={`font-sans text-sm mb-8 flex-1 ${isPopular ? 'text-white/80' : 'text-primary/70'}`}>
                    {pkg.description}
                  </p>
                  <RazorpayCheckoutButton 
                    amount={pkg.price} 
                    packageId={pkg.id} 
                    label={`Get ${pkg.name.split(' ')[0]}`} 
                    variant={isPopular ? "dark" : "default"} 
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Billing History */}
        <div className="pt-8 border-t border-secondary/30">
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
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-primary/50">No billing history found.</td>
                    </tr>
                  )}
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-secondary/20 hover:bg-secondary/5 transition-colors group">
                      <td className="py-4 pr-4 font-bold text-primary rounded-l-xl">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-4 text-primary/80">${order.amount.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${
                          order.status === 'PAID' ? 'bg-green-100/50 text-green-700 border-green-200' : 'bg-yellow-100/50 text-yellow-700 border-yellow-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right rounded-r-xl">
                        <Link href={`/invoice/${order.id}`} target="_blank" rel="noopener noreferrer" className="text-accent font-bold hover:underline">Download</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
