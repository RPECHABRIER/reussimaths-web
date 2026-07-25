import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, Swords, Clock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { useSubscription } from "../hooks/useProgress";
import { useReferrals } from "../hooks/useReferrals";
import { useFriends } from "../hooks/useFriends";
import { useChallenges, QUESTIONS_PER_CHALLENGE } from "../hooks/useChallenges";
import { chapters, getChapter } from "../chapters/registry";
import MiniDuel from "../components/MiniDuel";

const ink = "#1B2A4A";
const paper = "#F7F4EC";
const slate = "#5C6B7A";
const gold = "#D9A441";
const green = "#4E8B6B";

function Card({ children }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: "#ffffff", border: "1px solid #e4dfd0" }}>
      {children}
    </div>
  );
}

export default function Amis() {
  const { user, loading } = useAuth();
  const { profile } = useProfile(user?.id);
  const { isActive } = useSubscription(user?.id);
  const { count: referralCount } = useReferrals(user?.id);
  const { incoming, outgoing, accepted, profiles, sendRequest, respond, cancelRequest } = useFriends(user?.id);
  const { challenges, createChallenge, submitResponse } = useChallenges(user?.id);

  const [pseudoInput, setPseudoInput] = useState("");
  const [sendError, setSendError] = useState(null);
  const [sending, setSending] = useState(false);

  const [duelFriendId, setDuelFriendId] = useState(null);
  const [duelChapterId, setDuelChapterId] = useState("");
  const [activeDuel, setActiveDuel] = useState(null); // { mode: "new"|"respond", friendId, chapterId, challengeId }

  const accessibleChapters = useMemo(
    () =>
      chapters.filter((c) => {
        const freemium = !!c.meta.freemiumDaily;
        const referralUnlocked = !!c.meta.unlockReferrals && referralCount >= c.meta.unlockReferrals;
        return c.meta.free || freemium || isActive || referralUnlocked;
      }),
    [isActive, referralCount]
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement…</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p style={{ color: slate }}>Connecte-toi pour retrouver tes amis.</p>
        <Link to="/compte" className="text-sm underline" style={{ color: ink }}>
          Se connecter
        </Link>
      </div>
    );
  }

  const submitSearch = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendError(null);
    const { error } = await sendRequest(pseudoInput);
    setSending(false);
    if (error) setSendError(error);
    else setPseudoInput("");
  };

  const startNewDuel = (friendId) => {
    setDuelFriendId(friendId);
    setDuelChapterId(accessibleChapters[0]?.meta.id ?? "");
  };

  const launchDuel = () => {
    if (!duelChapterId) return;
    setActiveDuel({ mode: "new", friendId: duelFriendId, chapterId: duelChapterId });
    setDuelFriendId(null);
  };

  const launchResponse = (challenge) => {
    setActiveDuel({ mode: "respond", challengeId: challenge.id, chapterId: challenge.chapter_id, friendId: challenge.from_user });
  };

  const onDuelFinish = async (score) => {
    if (activeDuel.mode === "new") {
      await createChallenge(activeDuel.friendId, activeDuel.chapterId, score);
    } else {
      await submitResponse(activeDuel.challengeId, score);
    }
    setActiveDuel(null);
  };

  const pending_for_me = challenges.filter((c) => c.to_user === user.id && c.to_score === null);
  const waiting_on_friend = challenges.filter((c) => c.from_user === user.id && c.to_score === null);
  const finished = challenges.filter((c) => c.from_score !== null && c.to_score !== null);

  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: paper, fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-md mx-auto">
        <Link to="/" className="text-sm underline" style={{ color: slate }}>
          ← Accueil
        </Link>
        <div className="text-center my-6">
          <h1 style={{ fontFamily: "Fraunces, serif", color: ink, fontSize: "1.75rem", fontWeight: 600 }}>
            Amis & défis
          </h1>
          {profile?.pseudo && (
            <p className="text-sm mt-1" style={{ color: slate }}>
              Connecté en tant que {profile.pseudo}
            </p>
          )}
        </div>

        {activeDuel && (
          <div className="mb-6">
            <p className="text-sm mb-2 font-semibold" style={{ color: ink }}>
              Défi — {getChapter(activeDuel.chapterId)?.meta.title}
            </p>
            <MiniDuel chapter={getChapter(activeDuel.chapterId)} count={QUESTIONS_PER_CHALLENGE} onFinish={onDuelFinish} />
          </div>
        )}

        {!activeDuel && (
          <>
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2" style={{ color: ink }}>
                Ajouter un ami
              </p>
              <form onSubmit={submitSearch} className="flex gap-2">
                <input
                  value={pseudoInput}
                  onChange={(e) => setPseudoInput(e.target.value)}
                  placeholder="Pseudo de ton ami"
                  className="flex-1 rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1px solid #d5cfbc", backgroundColor: "#ffffff", color: ink }}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: ink, color: paper }}
                >
                  Ajouter
                </button>
              </form>
              {sendError && (
                <p className="text-xs mt-1" style={{ color: "#C1543C" }}>
                  {sendError}
                </p>
              )}
            </div>

            {incoming.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2" style={{ color: ink }}>
                  Demandes reçues
                </p>
                <div className="flex flex-col gap-2">
                  {incoming.map((r) => (
                    <Card key={r.user_id}>
                      <div className="flex items-center justify-between">
                        <span style={{ color: ink }}>{profiles[r.user_id]?.pseudo ?? "…"}</span>
                        <div className="flex gap-2">
                          <button onClick={() => respond(r.user_id, true)} className="p-1.5 rounded-full" style={{ backgroundColor: `${green}22`, color: green }}>
                            <Check size={16} />
                          </button>
                          <button onClick={() => respond(r.user_id, false)} className="p-1.5 rounded-full" style={{ backgroundColor: "#C1543C22", color: "#C1543C" }}>
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {outgoing.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2" style={{ color: ink }}>
                  Demandes envoyées
                </p>
                <div className="flex flex-col gap-2">
                  {outgoing.map((r) => (
                    <Card key={r.friend_id}>
                      <div className="flex items-center justify-between">
                        <span style={{ color: ink }}>{profiles[r.friend_id]?.pseudo ?? "…"}</span>
                        <button onClick={() => cancelRequest(r.friend_id)} className="text-xs underline" style={{ color: slate }}>
                          Annuler
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {pending_for_me.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2" style={{ color: ink }}>
                  Défis à relever
                </p>
                <div className="flex flex-col gap-2">
                  {pending_for_me.map((c) => (
                    <Card key={c.id}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p style={{ color: ink }}>{profiles[c.from_user]?.pseudo ?? "Un ami"}</p>
                          <p className="text-xs" style={{ color: slate }}>
                            {getChapter(c.chapter_id)?.meta.title ?? c.chapter_id} — score à battre : {c.from_score}/{QUESTIONS_PER_CHALLENGE}
                          </p>
                        </div>
                        <button
                          onClick={() => launchResponse(c)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                          style={{ backgroundColor: gold, color: ink }}
                        >
                          <Swords size={14} /> Jouer
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {waiting_on_friend.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2" style={{ color: ink }}>
                  En attente de réponse
                </p>
                <div className="flex flex-col gap-2">
                  {waiting_on_friend.map((c) => (
                    <Card key={c.id}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p style={{ color: ink }}>{profiles[c.to_user]?.pseudo ?? "Un ami"}</p>
                          <p className="text-xs" style={{ color: slate }}>
                            {getChapter(c.chapter_id)?.meta.title ?? c.chapter_id} — ton score : {c.from_score}/{QUESTIONS_PER_CHALLENGE}
                          </p>
                        </div>
                        <Clock size={16} color={slate} />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {finished.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2" style={{ color: ink }}>
                  Défis terminés
                </p>
                <div className="flex flex-col gap-2">
                  {finished.map((c) => {
                    const meScore = c.from_user === user.id ? c.from_score : c.to_score;
                    const otherScore = c.from_user === user.id ? c.to_score : c.from_score;
                    const otherId = c.from_user === user.id ? c.to_user : c.from_user;
                    const result = meScore > otherScore ? "Gagné 🎉" : meScore < otherScore ? "Perdu" : "Égalité";
                    return (
                      <Card key={c.id}>
                        <p style={{ color: ink }}>{profiles[otherId]?.pseudo ?? "Un ami"}</p>
                        <p className="text-xs" style={{ color: slate }}>
                          {getChapter(c.chapter_id)?.meta.title ?? c.chapter_id} — toi {meScore}/{QUESTIONS_PER_CHALLENGE} vs{" "}
                          {otherScore}/{QUESTIONS_PER_CHALLENGE} — {result}
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: ink }}>
                Mes amis
              </p>
              {accepted.length === 0 && (
                <p className="text-xs" style={{ color: slate }}>
                  Aucun ami pour l'instant — envoie une demande avec son pseudo.
                </p>
              )}
              <div className="flex flex-col gap-2">
                {accepted.map((r) => {
                  const otherId = r.user_id === user.id ? r.friend_id : r.user_id;
                  return (
                    <Card key={otherId}>
                      <div className="flex items-center justify-between">
                        <span style={{ color: ink }}>{profiles[otherId]?.pseudo ?? "…"}</span>
                        <button
                          onClick={() => startNewDuel(otherId)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                          style={{ backgroundColor: ink, color: paper }}
                        >
                          <Swords size={14} /> Défier
                        </button>
                      </div>
                      {duelFriendId === otherId && (
                        <div className="mt-3 pt-3" style={{ borderTop: "1px solid #e4dfd0" }}>
                          {accessibleChapters.length === 0 ? (
                            <p className="text-xs" style={{ color: slate }}>
                              Débloque au moins un chapitre pour lancer un défi.
                            </p>
                          ) : (
                            <>
                              <select
                                value={duelChapterId}
                                onChange={(e) => setDuelChapterId(e.target.value)}
                                className="w-full rounded-lg px-2 py-1.5 text-sm mb-2"
                                style={{ border: "1px solid #d5cfbc", color: ink }}
                              >
                                {accessibleChapters.map((c) => (
                                  <option key={c.meta.id} value={c.meta.id}>
                                    {c.meta.title}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={launchDuel}
                                className="w-full py-1.5 rounded-lg text-xs font-semibold"
                                style={{ backgroundColor: gold, color: ink }}
                              >
                                Lancer le défi ({QUESTIONS_PER_CHALLENGE} questions)
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
