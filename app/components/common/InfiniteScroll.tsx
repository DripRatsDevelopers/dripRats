"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

interface InfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  children: React.ReactNode;
  loader?: React.ReactNode;
  className?: string;
}

export function InfiniteScroll({
  loading,
  hasMore,
  loadMore,
  children,
  loader,
  className,
}: InfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const ref = observerRef.current;

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries, observer) => {
        if (entries[0].isIntersecting) {
          loadMore();
          observer.unobserve(entries[0].target);
          observer.disconnect();
        }
      },
      { threshold: 1 }
    );

    if (ref) observer.observe(ref);

    return () => {
      if (ref) {
        observer.disconnect();
      }
    };
  }, [loadMore, hasMore, loading, ref]);

  return (
    <div className={className}>
      {children}
      {loading &&
        (loader || (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          </div>
        ))}
      <div ref={observerRef} className="h-1" />
    </div>
  );
}
