import { motion } from "motion/react";

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft">
      <div className="aspect-[4/3] w-full bg-gray-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-100 rounded-full w-full animate-pulse" />
          <div className="h-3 bg-gray-100 rounded-full w-2/3 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-100 rounded-full w-1/3 animate-pulse" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="h-5 bg-gray-200 rounded-full w-1/4 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-5 bg-gray-100 rounded-full w-12 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="h-3 bg-gray-200 rounded-full w-48 animate-pulse" />
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-80 sm:h-96 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded-full w-2/3 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded-full w-1/3 animate-pulse" />
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-3">
            <div className="h-5 bg-gray-200 rounded-full w-32 animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded-full w-full animate-pulse" />
              <div className="h-3 bg-gray-100 rounded-full w-4/5 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded-full w-3/5 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded-full w-1/2 mx-auto animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 bg-gray-100 rounded-full w-1/3 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded-full w-1/4 animate-pulse" />
                </div>
              ))}
            </div>
            <div className="h-10 bg-gray-200 rounded-xl w-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonHistory() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-4">
      <div className="h-8 bg-gray-200 rounded-full w-48 animate-pulse" />
      <div className="h-4 bg-gray-100 rounded-full w-64 animate-pulse" />
      <div className="mt-8 space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center justify-between"
          >
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded-full w-1/2 animate-pulse" />
            </div>
            <div className="flex gap-2 ml-4">
              <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
