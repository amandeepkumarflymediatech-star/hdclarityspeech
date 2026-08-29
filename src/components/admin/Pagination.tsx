'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6 bg-white border-t border-secondary mt-4 rounded-b-xl shadow-sm">
      <div className="flex flex-1 justify-between sm:hidden">
        <Link
          href={createPageURL(currentPage - 1)}
          className={`relative inline-flex items-center rounded-md border border-secondary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-secondary/20 ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
        >
          Previous
        </Link>
        <Link
          href={createPageURL(currentPage + 1)}
          className={`relative ml-3 inline-flex items-center rounded-md border border-secondary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-secondary/20 ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
        >
          Next
        </Link>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-primary/70">
            Showing page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Link
              href={createPageURL(currentPage - 1)}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-primary ring-1 ring-inset ring-secondary hover:bg-secondary/20 focus:z-20 focus:outline-offset-0 ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Link>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
              .map((page, index, array) => {
                if (index > 0 && page - array[index - 1] > 1) {
                  return (
                    <React.Fragment key={page}>
                      <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-primary/50 ring-1 ring-inset ring-secondary">
                        ...
                      </span>
                      <Link
                        href={createPageURL(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-secondary focus:z-20 focus:outline-offset-0 ${currentPage === page ? 'bg-accent text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent z-10' : 'text-primary hover:bg-secondary/20'}`}
                      >
                        {page}
                      </Link>
                    </React.Fragment>
                  );
                }
                
                return (
                  <Link
                    key={page}
                    href={createPageURL(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-secondary focus:z-20 focus:outline-offset-0 ${currentPage === page ? 'bg-accent text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent z-10' : 'text-primary hover:bg-secondary/20'}`}
                  >
                    {page}
                  </Link>
                );
              })}

            <Link
              href={createPageURL(currentPage + 1)}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-primary ring-1 ring-inset ring-secondary hover:bg-secondary/20 focus:z-20 focus:outline-offset-0 ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
