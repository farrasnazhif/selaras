"use client";

import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SelarasLoadingState } from "@/components/ui/selaras-loading-state";

const AuthContext = createContext<User | null>(null);

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: User;
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const currentId = useRef(initialUser.id);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const { data } = createClient().auth.onAuthStateChange(
      (_event, session) => {
        const nextUser = session?.user ?? null;
        if (currentId.current !== (nextUser?.id ?? "")) {
          queryClient.clear();
          currentId.current = nextUser?.id ?? "";
        }
        setUser(nextUser);
        if (!nextUser)
          router.replace("/login?message=Sesi+berakhir.+Silakan+masuk+kembali.");
      },
    );
    return () => data.subscription.unsubscribe();
  }, [queryClient, router]);

  if (!user)
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <SelarasLoadingState label="Kembali ke halaman masuk…" />
      </div>
    );
  return <AuthContext value={user}><Fragment key={user.id}>{children}</Fragment></AuthContext>;
}

export function useAuth() {
  return useContext(AuthContext);
}
