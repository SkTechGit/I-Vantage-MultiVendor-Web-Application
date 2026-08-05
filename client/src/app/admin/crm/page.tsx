import React from "react";

export default function Page() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Page Title</h1>
          <p className="mt-2 text-gray-600">
            Add your page description here.
          </p>
        </header>

        {/* Main Content */}
        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Section Title
          </h2>

          <p className="text-gray-600">
            Your page content goes here.
          </p>
        </section>
      </div>
    </main>
  );
}