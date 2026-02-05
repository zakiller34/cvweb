import { CsrfProvider } from "@/components/csrf-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <CsrfProvider>
      <div className="min-h-screen bg-[var(--background)]">
        {children}
      </div>
    </CsrfProvider>
  );
}
