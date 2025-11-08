export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="space-y-6">
        {/* Skeleton for article cards */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse space-y-4 rounded-lg border border-gray-200 dark:border-gray-800 p-4"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
