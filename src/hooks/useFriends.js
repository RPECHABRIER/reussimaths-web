import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Amis et demandes d'ami, basé sur la table `friendships`
// (user_id = expéditeur de la demande, friend_id = destinataire, status).
export function useFriends(userId) {
  const [rows, setRows] = useState([]);
  const [profiles, setProfiles] = useState({}); // user_id -> { user_id, pseudo }
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setRows([]);
      setProfiles({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("friendships")
      .select("*")
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`);
    if (error) console.error("[useFriends] load error:", error.message);
    const list = data ?? [];
    setRows(list);

    const otherIds = Array.from(new Set(list.map((r) => (r.user_id === userId ? r.friend_id : r.user_id))));
    if (otherIds.length) {
      const { data: profs, error: profErr } = await supabase.from("profiles").select("user_id,pseudo").in("user_id", otherIds);
      if (profErr) console.error("[useFriends] profiles error:", profErr.message);
      const map = {};
      (profs ?? []).forEach((p) => (map[p.user_id] = p));
      setProfiles(map);
    } else {
      setProfiles({});
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const incoming = rows.filter((r) => r.friend_id === userId && r.status === "pending");
  const outgoing = rows.filter((r) => r.user_id === userId && r.status === "pending");
  const accepted = rows.filter((r) => r.status === "accepted");

  const sendRequest = useCallback(
    async (pseudo) => {
      const trimmed = pseudo.trim();
      if (!trimmed) return { error: "Entre un pseudo." };
      const { data: target, error: findErr } = await supabase
        .from("profiles")
        .select("user_id, pseudo")
        .ilike("pseudo", trimmed)
        .maybeSingle();
      if (findErr || !target) return { error: "Pseudo introuvable." };
      if (target.user_id === userId) return { error: "Tu ne peux pas t'ajouter toi-même." };
      const already = rows.find(
        (r) =>
          (r.user_id === userId && r.friend_id === target.user_id) ||
          (r.friend_id === userId && r.user_id === target.user_id)
      );
      if (already) return { error: "Une demande existe déjà avec ce pseudo." };
      const { error } = await supabase
        .from("friendships")
        .insert({ user_id: userId, friend_id: target.user_id, status: "pending" });
      if (error) return { error: "Impossible d'envoyer la demande." };
      await load();
      return { error: null };
    },
    [userId, rows, load]
  );

  const respond = useCallback(
    async (fromUserId, accept) => {
      if (accept) {
        await supabase.rpc("accept_friend_request", { p_from_user: fromUserId });
      } else {
        await supabase.from("friendships").delete().eq("user_id", fromUserId).eq("friend_id", userId);
      }
      await load();
    },
    [userId, load]
  );

  const cancelRequest = useCallback(
    async (toUserId) => {
      await supabase.from("friendships").delete().eq("user_id", userId).eq("friend_id", toUserId);
      await load();
    },
    [userId, load]
  );

  return { incoming, outgoing, accepted, profiles, loading, sendRequest, respond, cancelRequest, reload: load };
}
