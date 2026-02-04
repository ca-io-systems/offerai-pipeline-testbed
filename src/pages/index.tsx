import React from "react";
import { createRoot } from "react-dom/client";
import { Header } from "../components/Header";
import { useUser } from "../hooks/useUser";

function HomePage() {
  const { user, isLoading } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} isLoading={isLoading} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome{user ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-lg text-gray-600">
          {user
            ? "You're logged in. Explore our platform."
            : "Sign up or log in to get started."}
        </p>
      </main>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<HomePage />);
