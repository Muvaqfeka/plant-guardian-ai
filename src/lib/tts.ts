const LANGUAGE_CODES: Record<string, string> = {
  en: "en-US",
  ta: "ta-IN",
  te: "te-IN",
  hi: "hi-IN",
  fr: "fr-FR",
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  ta: "தமிழ்",
  te: "తెలుగు",
  hi: "हिन्दी",
  fr: "Français",
};

export function getLanguages() {
  return Object.entries(LANGUAGE_NAMES).map(([code, name]) => ({ code, name }));
}

export function speak(text: string, langCode: string = "en") {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANGUAGE_CODES[langCode] || "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang.startsWith(LANGUAGE_CODES[langCode]?.split("-")[0] || "en"));
  if (match) utterance.voice = match;
  
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}
