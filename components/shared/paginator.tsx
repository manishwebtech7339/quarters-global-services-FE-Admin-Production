'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

type PaginatorProps = {
  totalItems: number; // In your case, this is actually totalPages
  showPreviousNext?: boolean;
};

export default function Paginator({
  totalItems: totalPages, // Renaming for clarity inside the component
  showPreviousNext = true,
}: PaginatorProps) {
  const searchParams = useSearchParams();
  const currentPage = Math.max(1, Number(searchParams.get('page') || 1));

  // Helper to maintain existing URL filters (like ?search=abc)
  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `?${params.toString()}`;
  };

  // Hide component if there's only one page
  if (totalPages <= 1) return null;

  const renderPages = () => {
    const pages = [];
    const siblings = 1; // Number of pages to show on each side of current page

    for (let i = 1; i <= totalPages; i++) {
      // Logic: Always show first, last, and pages immediately around current
      const isFirstPage = i === 1;
      const isLastPage = i === totalPages;
      const isWithinRange = i >= currentPage - siblings && i <= currentPage + siblings;

      if (isFirstPage || isLastPage || isWithinRange) {
        pages.push(
          <PaginationItem key={i}>
            <Link
              href={buildHref(i)}
              scroll={false}
              className={cn(
                buttonVariants({
                  variant: currentPage === i ? 'default' : 'outline',
                  size: 'icon',
                }),
                'h-9 w-9',
                currentPage === i && 'pointer-events-none',
              )}
            >
              {i}
            </Link>
          </PaginationItem>,
        );
      }
      // Add Ellipsis if there is a gap between 1 and the range, or range and last
      else if (i === currentPage - siblings - 1 || i === currentPage + siblings + 1) {
        pages.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent className="gap-2">
        {/* Previous Button */}
        {showPreviousNext && (
          <PaginationItem>
            <Link
              href={buildHref(currentPage - 1)}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'px-3',
                currentPage <= 1 && 'pointer-events-none opacity-40',
              )}
            >
              Previous
            </Link>
          </PaginationItem>
        )}

        {/* Numbered Pages */}
        {renderPages()}

        {/* Next Button */}
        {showPreviousNext && (
          <PaginationItem>
            <Link
              href={buildHref(currentPage + 1)}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'px-3',
                currentPage >= totalPages && 'pointer-events-none opacity-40',
              )}
            >
              Next
            </Link>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
