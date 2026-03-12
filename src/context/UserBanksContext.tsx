"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { createClient } from "@/lib/supabase/client";

interface UserBanksContextType {
  userBanks: string[];
  hasBank: (bankName: string) => boolean;
  addBank: (bankName: string) => Promise<void>;
  removeBank: (bankName: string) => Promise<void>;
  setBanks: (bankNames: string[]) => Promise<void>;
  isLoaded: boolean;
}

const UserBanksContext = createContext<UserBanksContextType | undefined>(undefined);

export function UserBanksProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userBanks, setUserBanks] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  useEffect(() => {
    if (!user) {
      setUserBanks([]);
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);
    supabase
      .from("user_banks")
      .select("bank_name")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setUserBanks((data || []).map((r) => r.bank_name));
        setIsLoaded(true);
      });
  }, [user, supabase]);

  const hasBank = useCallback(
    (bankName: string) => userBanks.includes(bankName),
    [userBanks]
  );

  const addBank = useCallback(
    async (bankName: string) => {
      if (!user || userBanks.includes(bankName)) return;
      setUserBanks((prev) => [...prev, bankName]);
      await supabase.from("user_banks").insert({ user_id: user.id, bank_name: bankName });
    },
    [user, userBanks, supabase]
  );

  const removeBank = useCallback(
    async (bankName: string) => {
      if (!user) return;
      setUserBanks((prev) => prev.filter((b) => b !== bankName));
      await supabase
        .from("user_banks")
        .delete()
        .eq("user_id", user.id)
        .eq("bank_name", bankName);
    },
    [user, supabase]
  );

  const setBanks = useCallback(
    async (bankNames: string[]) => {
      if (!user) return;
      setUserBanks(bankNames);
      // Delete all existing and insert new ones
      await supabase.from("user_banks").delete().eq("user_id", user.id);
      if (bankNames.length > 0) {
        await supabase.from("user_banks").insert(
          bankNames.map((bank_name) => ({ user_id: user.id, bank_name }))
        );
      }
    },
    [user, supabase]
  );

  return (
    <UserBanksContext.Provider value={{ userBanks, hasBank, addBank, removeBank, setBanks, isLoaded }}>
      {children}
    </UserBanksContext.Provider>
  );
}

export function useUserBanks() {
  const context = useContext(UserBanksContext);
  if (!context) throw new Error("useUserBanks must be used within UserBanksProvider");
  return context;
}
