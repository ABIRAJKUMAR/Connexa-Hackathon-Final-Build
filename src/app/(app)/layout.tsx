export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 md:p-8 relative max-w-6xl mx-auto flex flex-col min-h-full">
      {children}
    </div>
  );
}
