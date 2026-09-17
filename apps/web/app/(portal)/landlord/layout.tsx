/** Server. Landlord portal shell. Figures read live; never cached. */
export default function LandlordLayout({ children }: LayoutProps<'/landlord'>) {
  return <div className="min-h-dvh bg-mist-50">{children}</div>;
}
