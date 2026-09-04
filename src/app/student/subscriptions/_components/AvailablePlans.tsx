"use client";

import { useState } from "react";
import RazorpayCheckoutButton from "@/components/student/RazorpayCheckoutButton";

export default function AvailablePlans({ packages, standaloneSession }: { packages: any[], standaloneSession: any }) {
  const [isIndianStudent, setIsIndianStudent] = useState(false);

  return (
    <div className="pt-8 border-t border-secondary/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-3xl font-black text-primary font-playfair tracking-tight">Available Plans</h2>
        
        <label className="flex items-center space-x-4 cursor-pointer bg-white px-6 py-4 rounded-xl shadow-sm border border-secondary/20 hover:border-primary/50 transition-colors">
          <span className="text-sm sm:text-base font-medium text-primary">I am an Indian student (Applies 18% GST)</span>
          <div className="relative flex items-center">
            <input 
              type="checkbox" 
              className="sr-only"
              checked={isIndianStudent}
              onChange={(e) => setIsIndianStudent(e.target.checked)}
            />
            <div className={`block w-14 h-8 rounded-full transition-colors ${isIndianStudent ? 'bg-accent' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 bg-white w-6 h-6 rounded-full transition-transform ${isIndianStudent ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
        
        {/* Standalone Class */}
        {standaloneSession && (
          <div className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <h3 className="text-xl font-black text-primary font-playfair mb-2">{standaloneSession.name}</h3>
            <p className="text-4xl font-black text-primary font-playfair tracking-tight mb-4">${standaloneSession.basePrice}</p>
            <p className="text-primary/70 font-sans text-sm mb-8 flex-1">{standaloneSession.description}</p>
            <RazorpayCheckoutButton 
              amount={standaloneSession.basePrice} 
              packageId={standaloneSession.id} 
              label="Buy Single Class" 
              isIndianStudent={isIndianStudent}
            />
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
              <p className={`text-4xl font-black font-playfair tracking-tight mb-1 ${!isPopular ? 'text-primary' : ''}`}>
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
                isIndianStudent={isIndianStudent}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
