import { Suspense } from "react";
import { Dashboard } from "./components/Dashboard";
import { colors } from "@/theme/colors";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.background.default }}>
      <Suspense
        fallback={
          <div style={{ padding: "2rem 0", textAlign: "center", color: colors.text.secondary }}>
            Loading…
          </div>
        }
      >
        <Dashboard />
      </Suspense>
    </div>
  );
}
