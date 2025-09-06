import type { Me, Permission } from "./types";

export const ALL_PERMS: Permission[] = [
  "users.read","users.write",
  "providers.read","providers.write",
  "agents.read","agents.write",
  "profiles.read","profiles.write",
  "conversations.read","conversations.write",
  "stats.read","stats.write",
];

export function hasPerm(me: Me | undefined, perm: Permission): boolean {
  if (!me) return false;
  if (me.user.role === "superadmin") return true; // superadmin = todo marcado [x]
  return me.permissions.includes(perm);
}
