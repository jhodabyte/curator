import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <Outlet />
    </main>
  );
}
