import { Users, TrendingUp, DollarSign, Activity, CreditCard } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import RevenueChart from "@/components/admin/RevenueChart";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [totalUsers, activePackages, activeSessions, completedSessions] = await Promise.all([
    prisma.user.count(),
    prisma.studentPackage.count({ where: { status: 'ACTIVE' } }),
    prisma.session.count({ where: { status: 'SCHEDULED' } }),
    prisma.session.count({ where: { status: 'COMPLETED' } })
  ]);

  // Revenue calculation from paid orders
  const orders = await prisma.order.findMany({ where: { status: 'PAID' } });
  const monthlyRevenue = orders.reduce((total, order) => total + order.amount, 0);

  const stats = [
    { name: 'Total Users', value: totalUsers.toString(), change: 'Current', icon: Users },
    { name: 'Active Packages', value: activePackages.toString(), change: 'Current', icon: TrendingUp },
    { name: 'Total Revenue', value: `$${monthlyRevenue}`, change: 'Est.', icon: DollarSign },
    { name: 'Upcoming Sessions', value: activeSessions.toString(), change: 'Current', icon: Activity },
  ];

  // Get all orders for the current year to calculate monthly revenue
  const currentYear = new Date().getFullYear();
  const yearlyOrders = await prisma.order.findMany({
    where: { 
      status: 'PAID',
      createdAt: {
        gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
      }
    }
  });

  const monthlyRevenueData = Array(12).fill(0);
  yearlyOrders.forEach(order => {
    const monthIndex = new Date(order.createdAt).getMonth();
    monthlyRevenueData[monthIndex] += order.amount;
  });
  
  const maxRevenue = Math.max(...monthlyRevenueData, 100);

  // Fetch recent activity
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { student: true, package: true }
  });

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hrs ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const combinedActivity = [
    ...recentOrders.map(o => ({
      title: o.status === 'PAID' ? 'New package purchase' : (o.status === 'FAILED' ? 'Payment failed' : 'Order pending'),
      desc: o.package 
        ? `${o.student?.name || o.student?.email} ordered ${o.package.name}` 
        : `${o.student?.name || o.student?.email} ordered a session`,
      time: formatTimeAgo(o.createdAt),
      timestamp: o.createdAt.getTime(),
      icon: o.status === 'FAILED' ? DollarSign : CreditCard
    })),
    ...recentUsers.map(u => ({
      title: 'New user registered',
      desc: `${u.name || u.email} joined as ${u.role}`,
      time: formatTimeAgo(u.createdAt),
      timestamp: u.createdAt.getTime(),
      icon: Users
    }))
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/50 pb-6">
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-xs font-sans">Admin Portal</h4>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Dashboard</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Welcome back. Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border border-secondary/30 rounded-3xl p-8 hover:border-accent/50 hover:shadow-lg transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">{stat.name}</p>
                <h3 className="text-4xl font-black text-primary mt-3 tracking-tight font-playfair">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-2xl bg-secondary/20 text-accent border border-secondary/30 group-hover:bg-accent group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-accent/20 group-hover:-translate-y-1`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-widest">{stat.change}</span>
              <span className="text-xs font-bold text-primary/50 uppercase tracking-widest">real-time</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-secondary/30 rounded-3xl p-8 sm:p-10 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b border-secondary/30 pb-6">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Revenue Analytics</h3>
            <select className="bg-secondary/10 border border-secondary/50 rounded-xl px-4 py-2 text-xs font-bold text-primary outline-none uppercase tracking-widest focus:border-accent focus:ring-1 focus:ring-accent transition-all hover:bg-white cursor-pointer">
              <option>This Year</option>
            </select>
          </div>
          <RevenueChart monthlyData={monthlyRevenueData} />
        </div>

        <div className="bg-white border border-secondary/30 rounded-3xl flex flex-col shadow-sm overflow-hidden">
          <div className="p-8 border-b border-secondary/30 bg-secondary/10">
             <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Recent Activity</h3>
          </div>
          <div className="space-y-0 flex-1">
            {combinedActivity.length === 0 ? (
              <div className="p-6 text-center text-sm text-primary/50">No recent activity.</div>
            ) : (
              combinedActivity.map((item, i) => (
                <div key={i} className="flex gap-4 p-6 border-b border-secondary/30 last:border-0 hover:bg-gray-50 transition-colors group">
                  <div className={`p-3 rounded-2xl shrink-0 bg-secondary/30 text-primary border border-secondary/50 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-colors duration-300 shadow-sm`}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">{item.title}</p>
                    <p className="text-xs text-primary/70 mt-1 font-sans">{item.desc}</p>
                    <p className="text-[10px] text-accent mt-2 font-bold uppercase tracking-widest">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/admin/payments" className="block text-center w-full py-5 text-xs font-bold text-primary bg-secondary/10 border-t border-secondary/30 hover:text-accent hover:bg-secondary/20 transition uppercase tracking-widest">
            View All Activity
          </Link>
        </div>
      </div>
    </div>
  );
}