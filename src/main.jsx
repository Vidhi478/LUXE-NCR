import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowUpRight, Mail, Menu, Phone, X } from "lucide-react";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const navItems = ["Residences", "About", "Services", "Locations", "Contact"];

const heroImage =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85";

const properties = [
  {
    title: "Aravali Estate",
    location: "Chattarpur",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
    meta: "5 Acres / Pool / Orchard",
  },
  {
    title: "The Stone House",
    location: "Sultanpur",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85",
    meta: "Private Courtyard / Spa / Lawns",
  },
  {
    title: "Aurum Meadows",
    location: "Westend Greens",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    meta: "Designer Villa / Waterbody / Staff Wing",
  },
];

const services = [
  {
    label: "Private Acquisition",
    title: "Discreet access to rare farmhouse estates before they reach the open market.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=85",
  },
  {
    label: "Estate Advisory",
    title: "Land, architecture, lifestyle, compliance, and long-term value assessed with care.",
    image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=1500&q=85",
  },
  {
    label: "Lifestyle Curation",
    title: "From poolside entertaining to private gardens, every estate is matched to a way of living.",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1500&q=85",
  },
];

const locations = [
  {
    name: "Chattarpur",
    detail: "Architectural estates close to South Delhi with privacy, mature trees, and urban convenience.",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=85",
  },
  {
    name: "Westend Greens",
    detail: "A landmark address for expansive farmhouses, quiet roads, and established luxury living.",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
  },
  {
    name: "Sultanpur",
    detail: "Refined countryside living with access to Delhi, Gurgaon, and the airport corridor.",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=85",
  },
];

const testimonials = [
  "They understood that we were buying privacy, rituals, mornings, evenings, and a standard of living.",
  "Every visit felt composed. No noise, no pressure, just thoughtful guidance and exceptional homes.",
  "The team made Delhi NCR farmhouse buying feel precise, discreet, and deeply personal.",
];

function useLuxuryScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.85,
      touchMultiplier: 0.9,
      smoothWheel: true,
    });

    const raf = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}

function useRevealAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 46 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.25,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          },
        );
      });

      gsap.utils.toArray("[data-image-scale]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.08 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );
      });

      gsap.to(".hero-media", {
        scale: 1.12,
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);
}

function CursorFollower() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 110, damping: 24, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 110, damping: 24, mass: 0.4 });

  useEffect(() => {
    const move = (event) => {
      x.set(event.clientX - 16);
      y.set(event.clientY - 16);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return <motion.div className="cursor-follower" style={{ x: springX, y: springY }} aria-hidden="true" />;
}

function MagneticButton({ children, variant = "dark", href = "#contact" }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const move = (event) => {
      const rect = node.getBoundingClientRect();
      gsap.to(node, {
        x: (event.clientX - rect.left - rect.width / 2) * 0.18,
        y: (event.clientY - rect.top - rect.height / 2) * 0.18,
        duration: 0.45,
        ease: "power3.out",
      });
    };
    const leave = () => gsap.to(node, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.45)" });
    node.addEventListener("mousemove", move);
    node.addEventListener("mouseleave", leave);
    return () => {
      node.removeEventListener("mousemove", move);
      node.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <a ref={ref} href={href} className={`magnetic-button ${variant}`}>
      <span>{children}</span>
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8">
      <nav className="mx-auto flex max-w-[1500px] items-center justify-between border border-white/15 bg-black/18 px-5 py-4 text-white backdrop-blur-xl md:px-8">
        <a href="#" className="font-serif text-xl tracking-[0.16em]">
          LUXE NCR
        </a>
        <div className="hidden items-center gap-9 text-xs uppercase tracking-[0.22em] text-white/78 lg:flex">
          {navItems.map((item) => (
            <a key={item} className="nav-link" href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </div>
        <a className="hidden text-xs uppercase tracking-[0.22em] text-white/86 lg:block" href="tel:+919999999999">
          +91 99999 99999
        </a>
        <button className="lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <div className="mx-auto mt-2 flex max-w-[1500px] flex-col gap-1 bg-black px-5 py-5 text-white lg:hidden">
          {navItems.map((item) => (
            <a key={item} className="py-3 text-sm uppercase tracking-[0.2em]" href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}>
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero relative flex min-h-screen items-end overflow-hidden bg-black px-5 pb-14 text-white md:px-10 md:pb-20">
      <div className="hero-media absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.18),rgba(0,0,0,.45))]" />
      <motion.div
        className="relative z-10 mx-auto grid w-full max-w-[1500px] gap-9 lg:grid-cols-[1.05fr_.55fr]"
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
      >
        <div>
          <p className="eyebrow text-white/72">Luxury Farmhouses in Delhi NCR</p>
          <h1 className="mt-5 max-w-5xl font-serif text-[clamp(3.4rem,8.8vw,10.5rem)] leading-[0.88]">
            Private estates for a quieter standard of living.
          </h1>
        </div>
        <div className="flex max-w-md flex-col justify-end gap-8 justify-self-start lg:justify-self-end">
          <p className="text-lg leading-8 text-white/76">
            Curated farmhouse residences across Delhi NCR, designed around privacy, architecture, landscape, and a life lived with intention.
          </p>
          <div className="flex flex-wrap gap-3">
            <MagneticButton href="#residences" variant="light">
              View Residences
            </MagneticButton>
            <MagneticButton href="#contact" variant="outline">
              Private Enquiry
            </MagneticButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, text }) {
  return (
    <div data-reveal className="mx-auto max-w-[1500px] px-5 md:px-10">
      <p className="eyebrow">{eyebrow}</p>
      <div className="mt-5 grid gap-8 lg:grid-cols-[.9fr_.62fr] lg:items-end">
        <h2 className="font-serif text-[clamp(2.6rem,6vw,7.2rem)] leading-[0.95] text-charcoal">{title}</h2>
        {text && <p className="max-w-xl text-lg leading-8 text-stone-600">{text}</p>}
      </div>
    </div>
  );
}

function Properties() {
  return (
    <section id="residences" className="bg-ivory py-24 md:py-36">
      <SectionIntro
        eyebrow="Residences"
        title="Estate living, composed with restraint."
        text="An editorial selection of luxury farmhouses where architecture, landscape, water, and silence become part of the address."
      />
      <div className="mx-auto mt-16 grid max-w-[1500px] gap-5 px-5 md:px-10 lg:grid-cols-3">
        {properties.map((property, index) => (
          <article key={property.title} data-reveal className={`property-card ${index === 1 ? "lg:mt-16" : ""}`}>
            <div className="image-shell">
              <img data-image-scale src={property.image} alt={`${property.title} farmhouse in ${property.location}`} />
            </div>
            <div className="property-overlay">
              <p>{property.location}</p>
              <h3>{property.title}</h3>
              <span>{property.meta}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-warm-white py-24 md:py-40">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 md:px-10 lg:grid-cols-[.74fr_1fr] lg:items-center">
        <div data-reveal>
          <p className="eyebrow">About</p>
          <h2 className="mt-5 font-serif text-[clamp(2.8rem,6.6vw,7.8rem)] leading-[0.93] text-charcoal">
            The art of finding space without leaving the city behind.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-[.78fr_1fr] md:items-end">
          <div data-reveal className="overflow-hidden">
            <img
              data-image-scale
              className="h-[520px] w-full object-cover"
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"
              alt="Luxury farmhouse exterior with warm lighting"
            />
          </div>
          <div data-reveal className="space-y-8 border-l border-stone-300 pl-7">
            <p className="font-serif text-3xl leading-tight text-charcoal md:text-5xl">
              We represent farmhouses where proportion, privacy, and provenance matter.
            </p>
            <p className="text-lg leading-8 text-stone-600">
              From Chattarpur to Westend Greens and Sultanpur, each recommendation is shaped by how the estate feels at sunrise, how it hosts at night, and how gracefully it can serve generations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-stone py-24 md:py-36">
      <SectionIntro
        eyebrow="Services"
        title="Advisory made quiet, exacting, and personal."
        text="The process is intentionally calm: fewer properties, stronger judgment, and a sharper sense of what makes an estate truly exceptional."
      />
      <div className="mx-auto mt-20 max-w-[1500px] space-y-20 px-5 md:px-10">
        {services.map((service, index) => (
          <article key={service.label} data-reveal className={`service-row ${index % 2 ? "lg:flex-row-reverse" : ""}`}>
            <div className="service-image">
              <img data-image-scale src={service.image} alt={service.label} />
            </div>
            <div className="service-copy">
              <p className="eyebrow">{service.label}</p>
              <h3>{service.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Locations() {
  return (
    <section id="locations" className="bg-deep-black py-24 text-white md:py-36">
      <SectionIntro
        eyebrow="Locations"
        title="Destination addresses across Delhi NCR."
        text="Each micro-market has its own rhythm: access, landscape, community, and the quiet confidence of arrival."
      />
      <div className="mx-auto mt-16 grid max-w-[1500px] gap-5 px-5 md:px-10 lg:grid-cols-3">
        {locations.map((location) => (
          <article key={location.name} data-reveal className="destination-card">
            <img data-image-scale src={location.image} alt={`${location.name} luxury farmhouse location`} />
            <div>
              <h3>{location.name}</h3>
              <p>{location.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-ivory py-24 md:py-36">
      <div data-reveal className="mx-auto max-w-[1250px] px-5 text-center md:px-10">
        <p className="eyebrow">Testimonials</p>
        <div className="mt-8 font-serif text-[clamp(5rem,13vw,15rem)] leading-none text-champagne">“</div>
        <div className="grid gap-9 md:grid-cols-3">
          {testimonials.map((quote) => (
            <blockquote key={quote} className="testimonial">
              {quote}
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-black px-5 py-16 text-white md:px-10 md:py-24">
      <div className="mx-auto max-w-[1500px]">
        <p className="eyebrow text-white/55">Private Enquiry</p>
        <div className="mt-7 grid gap-10 border-b border-white/14 pb-14 lg:grid-cols-[1fr_.52fr] lg:items-end">
          <h2 className="font-serif text-[clamp(3rem,8vw,9rem)] leading-[0.9]">
            Begin with discretion.
          </h2>
          <div className="space-y-6 text-white/70">
            <p className="text-lg leading-8">
              Share the lifestyle, location, and privacy you are seeking. We will respond with a considered private shortlist.
            </p>
            <MagneticButton href="mailto:concierge@luxencr.com" variant="light">
              concierge@luxencr.com
            </MagneticButton>
          </div>
        </div>
        <div className="flex flex-col gap-8 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="text-sm uppercase tracking-[0.2em] text-white/45">Luxury Farmhouses in Delhi NCR</p>
          <div className="flex gap-4 text-white/68">
            <a aria-label="Call" href="tel:+919999999999"><Phone size={19} /></a>
            <a aria-label="Email" href="mailto:concierge@luxencr.com"><Mail size={19} /></a>
            <a aria-label="Instagram" className="social-word" href="#">IG</a>
            <a aria-label="LinkedIn" className="social-word" href="#">IN</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 950);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="loader"
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : "-100%" }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden={!visible}
    >
      <span>LUXE NCR</span>
    </motion.div>
  );
}

function App() {
  useLuxuryScroll();
  useRevealAnimations();

  return (
    <>
      <Loader />
      <CursorFollower />
      <Navbar />
      <main>
        <Hero />
        <Properties />
        <About />
        <Services />
        <Locations />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
