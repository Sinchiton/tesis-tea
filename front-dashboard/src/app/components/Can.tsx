"use client";
import type { ReactNode } from "react";
import { useMe } from "@/lib/auth";
import { hasPerm } from "@/lib/permissions";
import type { Permission } from "@/lib/types";

export default function Can({ perm, children }:{ perm: Permission; children: ReactNode }) {
  const { data: me } = useMe();
  if (!me) return null;
  return hasPerm(me, perm) ? <>{children}</> : null;
}
