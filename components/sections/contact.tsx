"use client";

import { useState, FormEvent } from "react";
import Script from "next/script";
import { SITE_CONFIG } from "@/lib/site-config";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { SectionHeader } from "@/components/ui/section-header";
import { FormInput, FormTextarea } from "@/components/ui/form-input";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const CONTACT_TEXT = {
  en: {
    title: "Get in Touch",
    intro: "I'm always open to discussing new projects, opportunities, or just having a chat about technology.",
    name: "Name",
    email: "Email",
    message: "Message",
    namePlaceholder: "John Doe",
    emailPlaceholder: "john@example.com",
    messagePlaceholder: "Your message...",
    send: "Send Message",
    sending: "Sending...",
    success: "Message sent successfully!",
    error: "Something went wrong. Please try again.",
    rateLimit: "Too many requests. Please wait a moment.",
  },
  fr: {
    title: "Me contacter",
    intro: "Je suis toujours ouvert à discuter de nouveaux projets, d'opportunités ou simplement à échanger sur la technologie.",
    name: "Nom",
    email: "Email",
    message: "Message",
    namePlaceholder: "Jean Dupont",
    emailPlaceholder: "jean@exemple.com",
    messagePlaceholder: "Votre message...",
    send: "Envoyer",
    sending: "Envoi...",
    success: "Message envoyé avec succès !",
    error: "Une erreur s'est produite. Veuillez réessayer.",
    rateLimit: "Trop de requêtes. Veuillez patienter.",
  },
};

export function Contact() {
  const { lang } = useLanguage();
  const t = CONTACT_TEXT[lang];
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "rateLimit">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);

    // Get reCAPTCHA token (skip if not configured)
    let recaptchaToken = "";
    if (RECAPTCHA_SITE_KEY && window.grecaptcha) {
      try {
        recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
          action: "contact",
        });
      } catch {
        // reCAPTCHA failed, proceed without token
      }
    }

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      recaptchaToken,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 429) {
        setStatus("rateLimit");
        return;
      }
      if (!res.ok) throw new Error();
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {RECAPTCHA_SITE_KEY && (
        <>
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          />
          <style>{`.grecaptcha-badge { visibility: hidden !important; }`}</style>
        </>
      )}
      <section id="contact" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader title={t.title} />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <AnimateOnScroll delay={100} className="space-y-6">
            <p className="text-[var(--muted)]">{t.intro}</p>

            <div className="space-y-4">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-3 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                zakaria.teffah [at] gmail [dot] com
              </a>

              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="flex items-center gap-3 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {SITE_CONFIG.phone}
              </a>

              <div className="flex items-center gap-3 text-[var(--muted)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {SITE_CONFIG.location}
              </div>
            </div>
          </AnimateOnScroll>

          {/* Contact form */}
          <AnimateOnScroll delay={200}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                type="text"
                id="name"
                name="name"
                label={t.name}
                placeholder={t.namePlaceholder}
                required
              />
              <FormInput
                type="email"
                id="email"
                name="email"
                label={t.email}
                placeholder={t.emailPlaceholder}
                required
              />
              <FormTextarea
                id="message"
                name="message"
                label={t.message}
                placeholder={t.messagePlaceholder}
                rows={5}
                required
              />

              {RECAPTCHA_SITE_KEY && (
                <p className="text-xs text-[var(--muted)] text-center">
                  Protected by reCAPTCHA.{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy</a>
                  {" - "}
                  <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms</a>
                </p>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.sending}
                  </span>
                ) : t.send}
              </Button>

              {status === "success" && (
                <div className="flex items-center justify-center gap-2 text-green-500 text-sm animate-fade-in">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t.success}
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center justify-center gap-2 text-red-500 text-sm animate-fade-in">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {t.error}
                </div>
              )}
              {status === "rateLimit" && (
                <div className="flex items-center justify-center gap-2 text-orange-500 text-sm animate-fade-in">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t.rateLimit}
                </div>
              )}
            </form>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
    </>
  );
}
