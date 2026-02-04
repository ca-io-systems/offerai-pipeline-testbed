import { useState, useEffect } from "react";
import type { PublicUser } from "../db/schema";

interface UseUserResult {
  user: PublicUser | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setError("Failed to fetch user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, isLoading, error, refetch: fetchUser };
}
