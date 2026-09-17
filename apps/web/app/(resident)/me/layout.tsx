/** Server. Resident PWA shell (Serwist later). */
export default function ResidentLayout({ children }: LayoutProps<'/me'>) {
  return <div className="min-h-dvh bg-mist-50">{children}</div>;
}
