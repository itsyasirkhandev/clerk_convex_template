export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto animate-pulse">
      {/* Title skeleton */}
      <div>
        <div className="h-7 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-4 w-72 bg-slate-100 dark:bg-slate-800/50 rounded mt-2"></div>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-800"></div>

      {/* Section heading */}
      <div className="flex flex-col gap-4">
        <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/50 rounded"></div>

        {/* Button skeleton */}
        <div className="h-12 w-56 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>

        {/* Numbers box skeleton */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
          <div className="h-6 w-64 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
        </div>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-800"></div>

      {/* Making changes skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-80 bg-slate-100 dark:bg-slate-800/50 rounded"></div>
        <div className="h-4 w-72 bg-slate-100 dark:bg-slate-800/50 rounded"></div>
      </div>
    </div>
  );
}
