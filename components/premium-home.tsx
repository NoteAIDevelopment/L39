"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, BriefcaseBusiness, CheckCircle2, Clock3, Compass, Gift, GraduationCap, Mail, MapPin, Menu, MoonStar, Phone, Plane, Play, Sparkles, Stars, SunMedium, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthModal from "./auth-modal";

type UserShape = { name: string; email: string; role: string };
type ThemeMode = "light" | "dark";

type BookingFormValues = {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  experience: string;
  passengers: number;
  giftVoucher: boolean;
  notes: string;
};

const bookingSchema: z.ZodType<BookingFormValues> = z.object({
  name: z.string().min(2, "Please share your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please share a phone number"),
  preferredDate: z.string().min(1, "Please choose a date"),
  experience: z.string().min(1, "Choose your experience"),
  passengers: z.coerce.number().min(1, "At least one passenger"),
  giftVoucher: z.boolean().default(false),
  notes: z.string().default(""),
});

const stats = [
  { value: 2500, suffix: "+", label: "Flights Completed" },
  { value: 98, suffix: "%", label: "Customer Satisfaction" },
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 5, suffix: "★", label: "Average Rating" },
];

const services = [
  { icon: Plane, title: "Jet Flight Experiences", text: "Experience the thrill of high-performance aviation with expert-led sorties." },
  { icon: GraduationCap, title: "Trial Flying Lessons", text: "Learn the basics of flight in a structured and confidence-building session." },
  { icon: BookOpen, title: "Flight Training", text: "From first flights to advanced maneuvers, train with world-class instruction." },
  { icon: BriefcaseBusiness, title: "Aircraft Hire", text: "Access premium aircraft for business travel, scenic routes, or private missions." },
  { icon: Compass, title: "Corporate Experiences", text: "Create unforgettable aviation moments for team outings and client events." },
  { icon: Gift, title: "Gift Experiences", text: "Turn a flying day into a memorable surprise with premium voucher packages." },
];

const aircraft = [
  { name: "AeroJet X8", speed: "520 mph", seats: "4", level: "Intermediate", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80" },
  { name: "Falcon T3", speed: "610 mph", seats: "6", level: "Advanced", image: "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=900&q=80" },
  { name: "Skyline V2", speed: "470 mph", seats: "2", level: "Beginner", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=900&q=80" },
];

const reviews = [
  { name: "Evelyn Hart", quote: "The atmosphere was luxurious, precise, and beautifully organized. It felt like a private jet concierge experience.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" },
  { name: "Daniel Foster", quote: "Everything from briefing to landing felt safe, polished, and unforgettable. I booked again the same month.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
  { name: "Mina Alvarez", quote: "A premium aviation brand with real heart. The team made my voucher experience feel truly special.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" },
];

const galleryImgs = [
  "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1494253109108-2e30c049369b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7f3d8ddb3f0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
];

const faqs = [
  { q: "What should I wear?", a: "Smart casual is ideal. We recommend closed-toe shoes and a light jacket for cabin comfort." },
  { q: "Can I bring guests?", a: "Yes. Most experiences allow guests to accompany you on the ground, and some include passenger seating options." },
  { q: "Minimum age?", a: "Guests typically need to be at least 14 years old for introductory flight experiences, with parental consent where required." },
  { q: "Weather policy?", a: "If weather conditions are unsuitable, we will reschedule or offer credit for a future flight window." },
  { q: "Cancellation policy?", a: "Bookings can be amended up to 48 hours before departure, subject to availability and our standard terms." },
  { q: "Medical requirements?", a: "Most experiences are suitable for healthy adults. We may request a brief medical declaration for certain flights." },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const step = () => {
      frame += 1;
      const progress = Math.min(frame / 30, 1);
      setCount(Math.round(value * progress));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function PremiumHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }
    const storedTheme = window.localStorage.getItem("aero-theme") as ThemeMode | null;
    return storedTheme ?? "dark";
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login");
  const [user, setUser] = useState<UserShape | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const storedUser = window.localStorage.getItem("aero-user");
    return storedUser ? (JSON.parse(storedUser) as UserShape) : null;
  });
  const [activeFaq, setActiveFaq] = useState(0);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const aircraftRowRef = useRef<HTMLDivElement | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema as never),
    defaultValues: {
      giftVoucher: false,
      notes: "",
      passengers: 1,
    },
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("aero-theme", theme);
  }, [theme]);

  const navClass = theme === "dark" ? "bg-slate-950/80 text-slate-100" : "bg-white/80 text-slate-900";
  const panelClass = theme === "dark" ? "bg-slate-900/70 text-slate-100" : "bg-white/90 text-slate-900";
  const mutedText = theme === "dark" ? "text-slate-400" : "text-slate-600";

  const onSubmitBooking = async (values: BookingFormValues) => {
    setBookingMessage(null);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Booking could not be created");
      }
      setBookingMessage(result.message || "Your booking request is confirmed");
      reset();
    } catch (error) {
      setBookingMessage(error instanceof Error ? error.message : "The booking request failed");
    }
  };

  const scrollAircraft = (direction: "left" | "right") => {
    const el = aircraftRowRef.current;
    if (!el) return;
    const amount = direction === "left" ? -360 : 360;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className={theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-[#F7F8FA] text-slate-900"}>
      <header className={`sticky top-0 z-40 border-b border-white/10 backdrop-blur-xl ${navClass}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="#home" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#004A99] text-sm font-semibold text-white">L39</div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em]">L39 Aviation</p>
              <p className={`text-xs ${mutedText}`}>Private flight experiences</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            {[
              ["Home", "#home"],
              ["Flight Experiences", "#experiences"],
              ["Flight Training", "#training"],
              ["Gift Vouchers", "#gifts"],
              ["Fleet", "#fleet"],
              ["About", "#about"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-[#D71920]">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded-full border border-white/10 p-2 transition hover:bg-white/10" aria-label="Toggle theme">
              {theme === "dark" ? <SunMedium size={18} /> : <MoonStar size={18} />}
            </button>
            {user ? (
              <Link href="/dashboard" className="hidden rounded-full border border-[#004A99]/20 bg-[#004A99] px-5 py-2 text-sm font-semibold text-white sm:inline-flex">Dashboard</Link>
            ) : (
              <button onClick={() => { setAuthMode("register"); setAuthModalOpen(true); }} className="hidden rounded-full bg-[#D71920] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b7141a] sm:inline-flex">
                Book Now
              </button>
            )}
            <button className="rounded-full border border-white/10 p-2 lg:hidden" onClick={() => setMobileMenuOpen((prev) => !prev)} aria-label="Toggle navigation">
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`border-t border-white/10 px-4 py-5 lg:hidden ${navClass}`}>
              <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm font-medium">
                {[
                  ["Home", "#home"],
                  ["Flight Experiences", "#experiences"],
                  ["Flight Training", "#training"],
                  ["Gift Vouchers", "#gifts"],
                  ["Fleet", "#fleet"],
                  ["About", "#about"],
                  ["Contact", "#contact"],
                ].map(([label, href]) => (
                  <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="rounded-2xl px-3 py-2 transition hover:bg-white/10">
                    {label}
                  </Link>
                ))}
                <button onClick={() => { setAuthMode("register"); setAuthModalOpen(true); setMobileMenuOpen(false); }} className="rounded-full bg-[#D71920] px-4 py-2 text-left font-semibold text-white">
                  Book Now
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main id="home">
        <section className="relative isolate overflow-hidden">
          <video className="absolute inset-0 h-full w-full object-cover" src="https://videos.pexels.com/video-files/3758585/3758585-hd_1920_1080_25fps.mp4" autoPlay muted loop playsInline />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,74,153,0.75),_transparent_45%),linear-gradient(90deg,rgba(0,0,0,0.95),rgba(0,0,0,0.45))]" />
          <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-md">
                <Sparkles size={16} className="text-[#D71920]" />
                Premium aviation experiences & bespoke training
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
                Experience the thrill of real jet aviation.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Fly with experienced instructors and discover the excitement of military-inspired aviation experiences designed for discerning travelers.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button onClick={() => { setAuthMode("register"); setAuthModalOpen(true); }} className="inline-flex items-center gap-2 rounded-full bg-[#D71920] px-6 py-3 font-semibold text-white transition hover:bg-[#b7141a]">
                  Book Your Flight <ArrowRight size={18} />
                </button>
                <a href="#experiences" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20">
                  <Play size={18} /> View Experiences
                </a>
              </div>
            </motion.div>
            <div className="mt-16 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-slate-200">
              <span className="h-2 w-2 rounded-full bg-[#D71920]" /> Scroll to explore
            </div>
          </div>
        </section>

        <section className={`border-y border-white/10 ${theme === "dark" ? "bg-slate-900/70" : "bg-white/80"}`}>
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6 lg:px-8">
            {stats.map((item) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xl">
                <p className="text-3xl font-semibold text-[#004A99] dark:text-[#7db6ff]">
                  {item.label.includes("Rating") ? <AnimatedCounter value={5} suffix="★" /> : <AnimatedCounter value={item.value} suffix={item.suffix} />}
                </p>
                <p className={`mt-2 text-sm ${mutedText}`}>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="experiences" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D71920]">Signature services</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Elevated aviation, tailored to your ambition.</h2>
            <p className={`mx-auto max-w-2xl text-lg ${mutedText}`}>Premium services for sightseeing, training, corporate events, and unforgettable gift experiences.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.article key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} whileHover={{ y: -8, scale: 1.01 }} className={`rounded-[2rem] border border-white/10 p-8 shadow-lg backdrop-blur ${panelClass}`}>
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#004A99] text-white">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className={`mt-4 leading-7 ${mutedText}`}>{service.text}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D71920]">
                    Discover <ArrowRight size={16} />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#004A99]/10 to-[#D71920]/10 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
            <div className="overflow-hidden rounded-[2rem]">
              <Image src="https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1400&q=80" alt="Pilot preparing for a premium aviation experience" width={900} height={700} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D71920]">Why choose us</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Trusted by serious flyers and first-time adventurers alike.</h2>
              <p className={`mt-5 text-lg leading-8 ${mutedText}`}>We pair elite instruction with modern aircraft and a refined service culture so every flight feels calm, exhilarating, and exceptionally safe.</p>
              <ul className="mt-8 space-y-4">
                {[
                  "Experienced instructors",
                  "Modern aircraft",
                  "Safety-first culture",
                  "Flexible booking",
                  "Gift vouchers",
                  "Excellent reviews",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-lg">
                    <CheckCircle2 className="text-[#D71920]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="fleet" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D71920]">Featured aircraft</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Our fleet, curated for performance and comfort.</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={() => scrollAircraft("left")} className="rounded-full border border-white/10 bg-white/10 p-3 transition hover:bg-white/20">←</button>
              <button onClick={() => scrollAircraft("right")} className="rounded-full border border-white/10 bg-white/10 p-3 transition hover:bg-white/20">→</button>
            </div>
          </div>

          <div ref={aircraftRowRef} className="mt-10 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
            {aircraft.map((item) => (
              <motion.article key={item.name} whileHover={{ y: -8, scale: 1.01 }} className="min-w-[300px] snap-start overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-xl backdrop-blur sm:min-w-[360px]">
                <Image src={item.image} alt={item.name} width={800} height={520} className="h-56 w-full object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold">{item.name}</h3>
                    <div className="rounded-full bg-[#004A99]/10 px-3 py-1 text-sm font-semibold text-[#004A99]">{item.level}</div>
                  </div>
                  <div className="mt-6 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
                    <div><p className="text-slate-500">Top speed</p><p className="mt-1 font-semibold">{item.speed}</p></div>
                    <div><p className="text-slate-500">Seats</p><p className="mt-1 font-semibold">{item.seats}</p></div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 rounded-full border border-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/10">Learn More</button>
                    <button onClick={() => { setAuthMode("register"); setAuthModalOpen(true); }} className="flex-1 rounded-full bg-[#D71920] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b7141a]">Book</button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className={`grid gap-8 rounded-[2rem] border border-white/10 p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-12 ${panelClass}`}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D71920]">Flight booking</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Reserve your aviation experience.</h2>
              <p className={`mt-5 max-w-xl text-lg leading-8 ${mutedText}`}>From a scenic flight to a certification-level lesson, every booking is followed by a dedicated courtesy call from our concierge team.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmitBooking)} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm" htmlFor="name">Name</label>
                <input id="name" className="w-full rounded-2xl border border-slate-300/60 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-950/70" {...register("name")} />
                {errors.name ? <p className="mt-2 text-sm text-[#D71920]">{errors.name.message}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm" htmlFor="email">Email</label>
                <input id="email" type="email" className="w-full rounded-2xl border border-slate-300/60 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-950/70" {...register("email")} />
                {errors.email ? <p className="mt-2 text-sm text-[#D71920]">{errors.email.message}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm" htmlFor="phone">Phone</label>
                <input id="phone" className="w-full rounded-2xl border border-slate-300/60 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-950/70" {...register("phone")} />
                {errors.phone ? <p className="mt-2 text-sm text-[#D71920]">{errors.phone.message}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm" htmlFor="preferredDate">Preferred date</label>
                <input id="preferredDate" type="date" className="w-full rounded-2xl border border-slate-300/60 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-950/70" {...register("preferredDate")} />
                {errors.preferredDate ? <p className="mt-2 text-sm text-[#D71920]">{errors.preferredDate.message}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm" htmlFor="experience">Experience</label>
                <select id="experience" className="w-full rounded-2xl border border-slate-300/60 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-950/70" defaultValue="" {...register("experience")}>
                  <option value="" disabled>Select experience</option>
                  <option value="Introductory">Introductory</option>
                  <option value="Training">Training</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Gift">Gift</option>
                </select>
                {errors.experience ? <p className="mt-2 text-sm text-[#D71920]">{errors.experience.message}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm" htmlFor="passengers">Passengers</label>
                <input id="passengers" type="number" min={1} className="w-full rounded-2xl border border-slate-300/60 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-950/70" {...register("passengers")} />
                {errors.passengers ? <p className="mt-2 text-sm text-[#D71920]">{errors.passengers.message}</p> : null}
              </div>
              <div className="md:col-span-2 rounded-2xl border border-[#004A99]/10 bg-[#004A99]/10 p-4">
                <label className="flex items-center gap-3 text-sm font-medium">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("giftVoucher")} />
                  Gift voucher booking
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm" htmlFor="notes">Additional notes</label>
                <textarea id="notes" rows={4} className="w-full rounded-2xl border border-slate-300/60 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-950/70" {...register("notes")} />
              </div>
              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="submit" disabled={isSubmitting} className="rounded-full bg-[#D71920] px-6 py-3 font-semibold text-white transition hover:bg-[#b7141a] disabled:opacity-70">
                  {isSubmitting ? "Submitting..." : "Book Flight"}
                </button>
                {bookingMessage ? <p className="text-sm font-medium text-[#004A99] dark:text-[#7db6ff]">{bookingMessage}</p> : null}
              </div>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D71920]">Testimonials</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Trusted by discerning aviation enthusiasts.</h2>
          </div>
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div className="animate-[marquee_20s_linear_infinite] flex gap-4">
              {[...reviews, ...reviews].map((review, index) => (
                <motion.article key={`${review.name}-${index}`} className="min-w-[280px] rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3">
                    <Image src={review.image} alt={review.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <div className="mt-1 flex items-center gap-1 text-[#D71920]">
                        {[...Array(5)].map((_, i) => <Stars key={i} size={14} fill="currentColor" />)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 leading-7 text-slate-300">“{review.quote}”</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D71920]">Gallery</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">A collection of cinematic aviation moments.</h2>
          </div>
          <div className="mt-10 columns-1 gap-4 space-y-4 md:columns-2 xl:columns-3">
            {galleryImgs.map((item, index) => (
              <motion.div key={item} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ scale: 1.01 }} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-xl">
                <Image src={item} alt={`Aviation gallery ${index + 1}`} width={800} height={900} className="h-auto w-full object-cover transition duration-500 hover:scale-110" />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className={`rounded-[2rem] border border-white/10 p-8 lg:p-12 ${panelClass}`}>
            <div className="flex flex-col gap-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D71920]">Frequently asked questions</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Everything you need before you take flight.</h2>
            </div>
            <div className="mt-10 space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.q} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
                  <button className="flex w-full items-center justify-between gap-4 text-left" onClick={() => setActiveFaq(index === activeFaq ? -1 : index)}>
                    <span className="text-lg font-semibold">{faq.q}</span>
                    <span className="text-2xl text-[#D71920]">{index === activeFaq ? "−" : "+"}</span>
                  </button>
                  {index === activeFaq ? <p className={`mt-4 leading-7 ${mutedText}`}>{faq.a}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white">
            <Image src="https://images.unsplash.com/photo-1511195382008-0d8da82d1ee2?auto=format&fit=crop&w=1600&q=80" alt="Aircraft cockpit during sunset" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover opacity-40" />
            <div className="relative bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30 px-8 py-16 sm:px-10 lg:px-16">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D71920]">Ready to take flight?</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Reserve your next aviation story.</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Luxury service, exceptional instruction, and unforgettable moments await from your first call to your final landing.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={() => { setAuthMode("register"); setAuthModalOpen(true); }} className="rounded-full bg-[#D71920] px-6 py-3 font-semibold text-white transition hover:bg-[#b7141a]">Book Today</button>
                <a href="#contact" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10">Contact Us</a>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className={`grid gap-8 rounded-[2rem] border border-white/10 p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-12 ${panelClass}`}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D71920]">Contact</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Visit our private aviation studio.</h2>
              <div className="mt-8 space-y-4">
                <p className="flex items-center gap-3"><MapPin className="text-[#D71920]" /> 92 Aviation Way, Heathrow, London</p>
                <p className="flex items-center gap-3"><Phone className="text-[#D71920]" /> +44 20 5555 0192</p>
                <p className="flex items-center gap-3"><Mail className="text-[#D71920]" /> concierge@l39aviation.com</p>
                <p className="flex items-center gap-3"><Clock3 className="text-[#D71920]" /> Mon–Sun • 7:00AM – 9:00PM</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-white/10">
              <iframe src="https://www.google.com/maps?q=Heathrow%20London&z=12&output=embed" className="h-[360px] w-full" loading="lazy" title="Aviation studio location" />
            </div>
          </div>
        </section>
      </main>

      <footer className={`border-t border-white/10 ${theme === "dark" ? "bg-slate-900/90" : "bg-white/70"}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#004A99] text-sm font-semibold text-white">L39</div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em]">L39 Aviation</p>
                <p className={`text-sm ${mutedText}`}>Luxury flight experiences and aviation services.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <p className="font-semibold uppercase tracking-[0.3em]">Quick links</p>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <Link href="#experiences" className="transition hover:text-white">Flight Experiences</Link>
              <Link href="#fleet" className="transition hover:text-white">Fleet</Link>
              <Link href="#contact" className="transition hover:text-white">Contact</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold uppercase tracking-[0.3em]">Policy</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
              <a href="#" className="transition hover:text-white">Privacy Policy</a>
              <a href="#" className="transition hover:text-white">Cookie Policy</a>
              <a href="#" className="transition hover:text-white">Terms</a>
            </div>
          </div>
        </div>
        <div className={`border-t border-white/10 px-4 py-5 text-center text-sm ${mutedText}`}>
          © 2026 L39 Aviation. All rights reserved.
        </div>
      </footer>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} onAuthenticated={(userData) => { setUser(userData); setAuthModalOpen(false); }} />
    </div>
  );
}
