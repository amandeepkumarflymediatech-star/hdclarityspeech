import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, User, Bell, Shield, Mail, Globe, Save } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Platform Settings</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage global configuration and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {[
            { name: "General", icon: Settings, active: true },
            { name: "Account", icon: User, active: false },
            { name: "Notifications", icon: Bell, active: false },
            { name: "Security", icon: Shield, active: false },
            { name: "Email", icon: Mail, active: false },
            { name: "Localization", icon: Globe, active: false },
          ].map(tab => (
            <button
              key={tab.name}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left font-bold uppercase tracking-widest text-xs transition-colors rounded-xl ${tab.active ? 'bg-primary text-white shadow-lg' : 'text-primary/70 hover:bg-secondary/30 hover:text-primary'}`}
            >
              <tab.icon size={16} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-black text-primary font-playfair tracking-tight mb-8">General Settings</h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Platform Name</label>
                  <input
                    type="text"
                    defaultValue="HD Clarity Speech"
                    className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Support Email</label>
                  <input
                    type="email"
                    defaultValue="hridey@hdclarityspeech.com"
                    className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Site Description</label>
                <textarea
                  defaultValue="Professional speech therapy services and tutoring."
                  rows={4}
                  className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white resize-none"
                />
              </div>

              <div className="pt-6 border-t border-secondary/30 flex justify-end">
                <button type="button" className="px-8 py-3.5 bg-accent hover:bg-primary hover:shadow-lg hover:-translate-y-0.5 text-white font-bold uppercase tracking-wider text-sm transition-all duration-300 rounded-xl flex items-center gap-2">
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-black text-red-600 font-playfair tracking-tight mb-6">Danger Zone</h2>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-6 bg-red-50 border border-red-200 rounded-2xl">
              <div>
                <h3 className="font-bold text-red-800 text-lg">Maintenance Mode</h3>
                <p className="text-sm text-red-700/80 mt-1">Take the platform offline for updates. Only admins can access the site while active.</p>
              </div>
              <button className="shrink-0 px-6 py-3 border-2 border-red-300 text-red-700 font-bold uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white hover:border-red-600 rounded-xl transition-all shadow-sm">
                Enable Maintenance Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
