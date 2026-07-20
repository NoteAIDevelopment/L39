"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [bookings, setBookings] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch(() => setBookings([]));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#D71920]">Administrator console</p>
            <h1 className="mt-3 text-3xl font-semibold">Manage aviation bookings</h1>
          </div>
          <Link href="/" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/10">Back home</Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6">
            <p className="text-sm text-slate-400">Open requests</p>
            <p className="mt-3 text-3xl font-semibold">{bookings.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6">
            <p className="text-sm text-slate-400">Users</p>
            <p className="mt-3 text-3xl font-semibold">18</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6">
            <p className="text-sm text-slate-400">Average rating</p>
            <p className="mt-3 text-3xl font-semibold">4.9</p>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/10 text-slate-300">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} className="border-t border-white/10 bg-slate-950/40">
                  <td className="px-4 py-3">{String(booking.name || "Unknown")}</td>
                  <td className="px-4 py-3">{String(booking.preferredDate || "Pending")}</td>
                  <td className="px-4 py-3">{String(booking.experience || "N/A")}</td>
                  <td className="px-4 py-3">{String(booking.status || "Pending")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
