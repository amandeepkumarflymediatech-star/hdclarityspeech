import { Users, TrendingUp, DollarSign, Activity, CreditCard } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [totalUsers, activeSubscriptions, activeSessions, premiumSubs] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.appointment.count({ where: { status: 'SCHEDULED' } }),
    prisma.subscription.count({ where: { status: 'ACTIVE', planType: 'PREMIUM' } })
  ]);

  // Rough estimation of monthly revenue (assuming Premium is $49, Pro is $99, Basic is $19)
  const subscriptions = await prisma.subscription.findMany({ where: { status: 'ACTIVE' } });
  const monthlyRevenue = subscriptions.reduce((total, sub) => {
    if (sub.planType === 'PRO') return total + 99;
    if (sub.planType === 'PREMIUM') return total + 49;
    if (sub.planType === 'BASIC') return total + 19;
    return total;
  }, 0);

  const stats = [
    { name: 'Total Users', value: totalUsers.toString(), change: 'Current', icon: Users },
    { name: 'Active Subscriptions', value: activeSubscriptions.toString(), change: 'Current', icon: TrendingUp },
    { name: 'Monthly Revenue', value: `$${monthlyRevenue}`, change: 'Est.', icon: DollarSign },
    { name: 'Upcoming Sessions', value: activeSessions.toString(), change: 'Current', icon: Activity },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary pb-6">
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-sm font-sans">Admin Portal</h4>
          <h1 className="text-4xl font-black text-primary tracking-tight font-playfair">Dashboard</h1>
          <p className="text-primary/70 mt-2 font-sans text-lg">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 bg-white border-2 border-primary hover:bg-primary text-primary hover:text-white font-bold uppercase tracking-wider text-sm transition-colors rounded-none">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border border-secondary p-8 hover:border-accent hover:shadow-sm transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">{stat.name}</p>
                <h3 className="text-4xl font-black text-primary mt-3 tracking-tight font-playfair">{stat.value}</h3>
              </div>
              <div className={`p-4 bg-secondary text-accent border border-accent/10 group-hover:bg-accent group-hover:text-white transition-colors`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 uppercase tracking-widest">{stat.change}</span>
              <span className="text-xs font-bold text-primary/50 uppercase tracking-widest">real-time</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-secondary p-10 flex flex-col">
          <div className="flex justify-between items-center mb-8 border-b border-secondary pb-6">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Revenue Analytics</h3>
            <select className="bg-secondary/30 border border-secondary rounded-none px-4 py-2 text-xs font-bold text-primary outline-none uppercase tracking-widest focus:border-accent transition-colors">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {[40, 70, 45, 90, 65, 85, 120, 95, 110, 80, 130, 100].map((h, i) => (
              <div key={i} className="w-full bg-secondary/30 border border-secondary/50 rounded-none relative group hover:bg-secondary transition-colors" style={{ height: '100%' }}>
                <div className="absolute bottom-0 w-full bg-primary rounded-none transition-all duration-500 group-hover:bg-accent" style={{ height: `${(h / 150) * 100}%` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-xs font-bold text-primary/50 px-2 uppercase tracking-widest">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        <div className="bg-white border border-secondary flex flex-col">
          <div className="p-8 border-b border-secondary bg-secondary/30">
             <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Recent Activity</h3>
          </div>
          <div className="space-y-0 flex-1">
            {[
              { title: 'New subscription', desc: 'Alice upgraded to Pro Plan', time: '2 hrs ago', icon: CreditCard },
              { title: 'New user registered', desc: 'John Doe joined the platform', time: '5 hrs ago', icon: Users },
              { title: 'Session completed', desc: 'Sarah finished a 1hr session', time: '1 day ago', icon: Activity },
              { title: 'Payment failed', desc: 'Failed charge for Mark', time: '2 days ago', icon: DollarSign },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 p-6 border-b border-secondary last:border-0 hover:bg-secondary/20 transition-colors group">
                <div className={`p-4 rounded-none shrink-0 bg-secondary text-primary border border-secondary group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-colors duration-300`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{item.title}</p>
                  <p className="text-sm text-primary/70 mt-1 font-sans">{item.desc}</p>
                  <p className="text-xs text-accent mt-2 font-bold uppercase tracking-widest">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-5 text-xs font-bold text-primary bg-secondary/30 border-t border-secondary hover:text-accent transition uppercase tracking-widest">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}