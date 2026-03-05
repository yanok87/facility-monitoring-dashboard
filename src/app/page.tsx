import { Suspense } from "react";
import { Dashboard } from "./components/Dashboard";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Suspense
        fallback={
          <div style={{ padding: "2rem 0", textAlign: "center", color: "#4A5568" }}>
            Loading…
          </div>
        }
      >
        <Dashboard />
      </Suspense>
    </div>
  );
}
