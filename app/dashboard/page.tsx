"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type UserShape = { name: string; email: string; role: string };

export default function DashboardPage() {
  const [user] = useState<UserShape | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const storedUser = window.localStorage.getItem("aero-user");
    return storedUser ? (JSON.parse(storedUser) as UserShape) : null;
  });
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
            <p className="text-sm uppercase tracking-[0.35em] text-[#D71920]">Member dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold">Welcome back, {user?.name || "pilot"}</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/10">Back home</Link>
            {user?.role === "Administrator" ? <Link href="/admin" className="rounded-full bg-[#D71920] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b7141a]">Admin panel</Link> : null}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6">
            <p className="text-sm text-slate-400">Upcoming bookings</p>
            <p className="mt-3 text-3xl font-semibold">{bookings.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6">
            <p className="text-sm text-slate-400">Gift vouchers</p>
            <p className="mt-3 text-3xl font-semibold">3</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6">
            <p className="text-sm text-slate-400">Loyalty points</p>
            <p className="mt-3 text-3xl font-semibold">840</p>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/10 text-slate-300">
              <tr>
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 4).map((booking, index) => (
                <tr key={index} className="border-t border-white/10 bg-slate-950/40">
                  <td className="px-4 py-3">{String(booking.name) || "Private flight"}</td>
                  <td className="px-4 py-3">{String(booking.preferredDate || "Pending")}</td>
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
