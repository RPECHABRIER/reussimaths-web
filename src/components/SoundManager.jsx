import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  TRACKS,
  CLICK_SOUND,
  CLICK_VOLUME,
  getZoneForPath,
  getStoredMuted,
  setStoredMuted,
  getStoredVolume,
} from "../lib/sound";
import { colors, fonts, shadow } from "../theme";

// Musique d'ambiance selon la page courante (voir getZoneForPath dans
// src/lib/sound.js) + bruitage de clic sur les liens et boutons. Composant
// monté une seule fois dans App.jsx, en dehors de <Routes> pour ne jamais
// être démonté lors des changements de page (sinon la musique
// recommencerait/couperait à chaque navigation).
//
// Contrainte "autoplay" des navigateurs : la lecture avec son ne peut
// démarrer qu'après une interaction de l'utilisateur (clic, touche...). On
// tente donc de lancer la musique à chaque changement de zone, et si le
// navigateur la bloque, on retente automatiquement au tout premier clic
// détecté sur la page (le même écouteur global qui gère le bruitage de clic).
const FADE_MS = 500;
const FADE_STEP_MS = 40;

export default function SoundManager() {
  const location = useLocation();
  const audioRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const currentZoneRef = useRef(null);
  const pendingPlayRef = useRef(false);
  const [muted, setMuted] = useState(getStoredMuted);
  const mutedRef = useRef(muted);
  const volumeRef = useRef(getStoredVolume());

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Crée l'élément <audio> une seule fois.
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  function clearFade() {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }

  function fadeTo(targetVolume, onDone) {
    const audio = audioRef.current;
    if (!audio) return;
    clearFade();
    const steps = Math.max(1, Math.round(FADE_MS / FADE_STEP_MS));
    const start = audio.volume;
    const delta = (targetVolume - start) / steps;
    let i = 0;
    fadeTimerRef.current = setInterval(() => {
      i += 1;
      audio.volume = Math.min(1, Math.max(0, start + delta * i));
      if (i >= steps) {
        clearFade();
        audio.volume = Math.max(0, targetVolume);
        onDone?.();
      }
    }, FADE_STEP_MS);
  }

  function tryPlay() {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    const playPromise = audio.play();
    if (playPromise?.catch) {
      playPromise
        .then(() => {
          pendingPlayRef.current = false;
        })
        .catch(() => {
          // Bloqué par la politique "autoplay" du navigateur : on retentera
          // au premier clic (voir l'écouteur global plus bas).
          pendingPlayRef.current = true;
        });
    }
  }

  // Changement de zone (page) : bascule douce (fondu) vers la nouvelle
  // musique, ou silence si la page courante n'en a pas.
  useEffect(() => {
    const zone = getZoneForPath(location.pathname);
    if (zone === currentZoneRef.current) return;
    currentZoneRef.current = zone;
    const audio = audioRef.current;
    if (!audio) return;

    const targetVolume = mutedRef.current ? 0 : volumeRef.current;

    if (!zone) {
      fadeTo(0, () => audio.pause());
      return;
    }

    const src = TRACKS[zone];
    if (!src) return;

    if (audio.volume <= 0.01 || audio.paused) {
      // Rien en cours : on peut changer la source directement.
      audio.src = src;
      audio.volume = 0;
      tryPlay();
      fadeTo(targetVolume);
    } else {
      // Une musique joue déjà : petit fondu enchaîné.
      fadeTo(0, () => {
        audio.src = src;
        audio.volume = 0;
        tryPlay();
        fadeTo(targetVolume);
      });
    }
  }, [location.pathname]);

  // Coupure/activation du son : ajuste le volume cible sans changer la piste.
  useEffect(() => {
    setStoredMuted(muted);
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      fadeTo(0);
    } else if (currentZoneRef.current) {
      if (!audio.src) audio.src = TRACKS[currentZoneRef.current] ?? "";
      tryPlay();
      fadeTo(volumeRef.current);
    }
  }, [muted]);

  // Bruitage de clic sur les liens et boutons, partout dans l'appli, +
  // déblocage de la lecture audio différée par la politique "autoplay" au
  // tout premier clic.
  useEffect(() => {
    function handleClick(event) {
      if (pendingPlayRef.current && !mutedRef.current) tryPlay();

      const target = event.target.closest?.("a, button, [role='button']");
      if (!target || target.disabled) return;
      if (mutedRef.current) return;
      try {
        const click = new Audio(CLICK_SOUND);
        click.volume = CLICK_VOLUME;
        click.play().catch(() => {});
      } catch {
        // lecture impossible (navigateur trop ancien...) : silencieux
      }
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return (
    <button
      onClick={() => setMuted((m) => !m)}
      aria-label={muted ? "Activer le son" : "Couper le son"}
      title={muted ? "Activer le son" : "Couper le son"}
      className="fixed bottom-4 right-4 z-50 flex items-center justify-center rounded-full"
      style={{
        width: 44,
        height: 44,
        backgroundColor: colors.card,
        boxShadow: shadow.raised,
        border: `1px solid ${colors.hairline}`,
        fontFamily: fonts.body,
      }}
    >
      {muted ? <SpeakerMutedIcon /> : <SpeakerIcon />}
    </button>
  );
}

function SpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 9v6h4l5 4V5L8 9H4z"
        fill={colors.ink}
      />
      <path
        d="M16.5 8.5a5 5 0 0 1 0 7"
        stroke={colors.ink}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19 6a8.5 8.5 0 0 1 0 12"
        stroke={colors.ink}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
    </svg>
  );
}

function SpeakerMutedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill={colors.slate} />
      <path
        d="M16 9l5 6M21 9l-5 6"
        stroke={colors.red}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
