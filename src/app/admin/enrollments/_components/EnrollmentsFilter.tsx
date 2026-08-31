'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, SortDesc } from 'lucide-react';

interface EnrollmentsFilterProps {
  currentTab: 'packages' | 'bookings' | 'sessions';
}

export default function EnrollmentsFilter({ currentTab }: EnrollmentsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  // When tab changes, reset status if it doesn't match the new tab's allowed statuses
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setStatus(searchParams.get('status') || 'ALL');
    setSort(searchParams.get('sort') || 'newest');
  }, [searchParams, currentTab]);

  const applyFilters = (newQ?: string, newStatus?: string, newSort?: string) => {
    const q = newQ !== undefined ? newQ : query;
    const s = newStatus !== undefined ? newStatus : status;
    const srt = newSort !== undefined ? newSort : sort;

    const params = new URLSearchParams(searchParams.toString());
    
    if (q) params.set('q', q);
    else params.delete('q');
    
    if (s && s !== 'ALL') params.set('status', s);
    else params.delete('status');

    if (srt && srt !== 'newest') params.set('sort', srt);
    else params.delete('sort');

    params.set('page', '1'); // Reset to page 1 on filter change

    router.push(`?${params.toString()}`);
  };

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      applyFilters(newQuery, undefined, undefined);
    }, 400);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    applyFilters(query, undefined, undefined);
  };

  // Define allowed statuses based on tab
  let statuses = ['ALL'];
  if (currentTab === 'packages') {
    statuses.push('ACTIVE', 'DEPLETED', 'EXPIRED');
  } else if (currentTab === 'bookings') {
    statuses.push('PENDING', 'PAID', 'SCHEDULED', 'CANCELLED', 'COMPLETED', 'FAILED');
  } else if (currentTab === 'sessions') {
    statuses.push('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'MISSED');
  }

  return (
    <div className="bg-secondary/5 border border-secondary/20 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
      <form onSubmit={handleSearch} className="relative w-full sm:w-auto flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
        <input 
          type="text" 
          placeholder="Search name or email..." 
          value={query}
          onChange={handleQueryChange}
          className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-secondary/30 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        />
      </form>

      <div className="flex w-full sm:w-auto items-center gap-4">
        <div className="relative flex-1 sm:flex-none">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
          <select 
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              applyFilters(undefined, e.target.value, undefined);
            }}
            className="w-full sm:w-40 pl-9 pr-8 py-2 text-sm font-medium text-primary bg-white border border-secondary/30 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-accent transition-colors uppercase tracking-wider text-[11px]"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="relative flex-1 sm:flex-none">
          <SortDesc className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
          <select 
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              applyFilters(undefined, undefined, e.target.value);
            }}
            className="w-full sm:w-40 pl-9 pr-8 py-2 text-sm font-medium text-primary bg-white border border-secondary/30 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-accent transition-colors uppercase tracking-wider text-[11px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="status-asc">Status (A-Z)</option>
            <option value="status-desc">Status (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
