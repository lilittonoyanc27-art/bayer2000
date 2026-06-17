/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Trophy, 
  HelpCircle, 
  BookOpen, 
  Utensils, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  XCircle, 
  User, 
  Users,
  Lightbulb, 
  MessageSquare,
  Sparkles,
  Play,
  ArrowRight,
  Info
} from "lucide-react";
import { MILLIONAIRE_QUESTIONS, Question, DIALOGUE_VOCABULARY, RESTAURANT_DIALOGUE, DialogueLine } from "./data";

// Web Audio API Sound Generator for retro/classic television feel
class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Lazy initialize to bypass browser autoplay policies
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playCorrect() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      // Happy arpeggio
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc1.frequency.setValueAtTime(1046.50, now + 0.3); // C6

      osc2.frequency.setValueAtTime(261.63, now); // C4
      osc2.frequency.setValueAtTime(329.63, now + 0.1); // E4
      osc2.frequency.setValueAtTime(392.00, now + 0.2); // G4
      osc2.frequency.setValueAtTime(523.25, now + 0.3); // C5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.log("Audio error:", e);
    }
  }

  playWrong() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      // Buzzy low disappointment slide
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(110, now + 0.4); // A2

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.log("Audio error:", e);
    }
  }

  playLifeline() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3); // A5

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.log("Audio error:", e);
    }
  }

  playVictory() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        
        gain.gain.setValueAtTime(0.12, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.8);
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.8);
      });
    } catch (e) {
      console.log("Audio error:", e);
    }
  }
}

const sounds = new SoundEffects();

// Millionaire scale of prize money (15 questions)
const MONEY_SCALE = [
  1000000, 500000, 250000, 125000, 64000, 32000, 16000, 8000, 4000, 2000, 1000, 500, 300, 200, 100
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"millionaire" | "dialogue">("millionaire");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Millionaire game state
  const [mCurrentIndex, setMCurrentIndex] = useState<number>(0);
  const [mScores, setMScores] = useState<{ Gor: number; Gayane: number }>({ Gor: 0, Gayane: 0 });
  const [mEarnings, setMEarnings] = useState<{ Gor: number; Gayane: number }>({ Gor: 0, Gayane: 0 });
  const [mSelectedAnswer, setMSelectedAnswer] = useState<string | null>(null);
  const [mIsAnswered, setMIsAnswered] = useState<boolean>(false);
  const [mIsCorrect, setMIsCorrect] = useState<boolean | null>(null);
  const [mLifelinesUsed, setMLifelinesUsed] = useState<{
    Gor: { fiftyFifty: boolean; askPartner: boolean; grammarPista: boolean };
    Gayane: { fiftyFifty: boolean; askPartner: boolean; grammarPista: boolean };
  }>({
    Gor: { fiftyFifty: false, askPartner: false, grammarPista: false },
    Gayane: { fiftyFifty: false, askPartner: false, grammarPista: false }
  });

  // active effects
  const [fiftyFiftyDisabled, setFiftyFiftyDisabled] = useState<string[]>([]);
  const [partnerAdvice, setPartnerAdvice] = useState<string | null>(null);
  const [showGrammarClue, setShowGrammarClue] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  // Dialogue game state
  // key: blankId, value: word assigned to that blank
  const [dAnswers, setDAnswers] = useState<{ [key: string]: string }>({});
  const [dSelectedBlankId, setDSelectedBlankId] = useState<string | null>(null);
  const [dSubmitted, setDSubmitted] = useState<boolean>(false);
  const [dResults, setDResults] = useState<{ [key: string]: boolean }>({});
  const [dScore, setDScore] = useState<number>(0);

  const getCurrentPlayer = (index: number = mCurrentIndex): "Gor" | "Gayane" => {
    // Alternating turns: Question 1 (index 0) is Gor, Question 2 (index 1) is Gayane
    return index % 2 === 0 ? "Gor" : "Gayane";
  };

  const getPartnerName = (player: "Gor" | "Gayane"): "Gor" | "Gayane" => {
    return player === "Gor" ? "Gayane" : "Gor";
  };

  const currentQuestion: Question = MILLIONAIRE_QUESTIONS[mCurrentIndex];
  const currentPlayer = getCurrentPlayer();

  // Reset Millionaire Game
  const resetMillionaire = () => {
    setMCurrentIndex(0);
    setMScores({ Gor: 0, Gayane: 0 });
    setMEarnings({ Gor: 0, Gayane: 0 });
    setMSelectedAnswer(null);
    setMIsAnswered(false);
    setMIsCorrect(null);
    setMLifelinesUsed({
      Gor: { fiftyFifty: false, askPartner: false, grammarPista: false },
      Gayane: { fiftyFifty: false, askPartner: false, grammarPista: false }
    });
    setFiftyFiftyDisabled([]);
    setPartnerAdvice(null);
    setShowGrammarClue(false);
    setGameFinished(false);
  };

  // Handle Millionaire answer selection
  const handleMillionaireAnswer = (option: string) => {
    if (mIsAnswered) return;
    setMSelectedAnswer(option);
    const isCorrect = option === currentQuestion.correctAnswer;
    setMIsCorrect(isCorrect);
    setMIsAnswered(true);

    if (isCorrect) {
      sounds.playCorrect();
      // Add points & earnings
      setMScores(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 1
      }));
      setMEarnings(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + currentQuestion.difficulty
      }));
    } else {
      sounds.playWrong();
    }
  };

  const handleNextQuestion = () => {
    setMSelectedAnswer(null);
    setMIsAnswered(false);
    setMIsCorrect(null);
    setFiftyFiftyDisabled([]);
    setPartnerAdvice(null);
    setShowGrammarClue(false);

    if (mCurrentIndex < MILLIONAIRE_QUESTIONS.length - 1) {
      setMCurrentIndex(prev => prev + 1);
    } else {
      setGameFinished(true);
      sounds.playVictory();
    }
  };

  // Run Lifelines
  const useFiftyFifty = () => {
    const player = getCurrentPlayer();
    if (mLifelinesUsed[player].fiftyFifty || mIsAnswered) return;
    sounds.playLifeline();

    // Pick two incorrect answers to disable
    const incorrectOptions = currentQuestion.options.filter(opt => opt !== currentQuestion.correctAnswer);
    // Shuffle and pick 2
    const toDisable = [...incorrectOptions].sort(() => 0.5 - Math.random()).slice(0, 2);
    setFiftyFiftyDisabled(toDisable);

    setMLifelinesUsed(prev => ({
      ...prev,
      [player]: { ...prev[player], fiftyFifty: true }
    }));
  };

  const useAskPartner = () => {
    const player = getCurrentPlayer();
    if (mLifelinesUsed[player].askPartner || mIsAnswered) return;
    sounds.playLifeline();

    const partner = getPartnerName(player);
    const prob = Math.random();
    let advice = "";
    const isPerfect = currentQuestion.tense === "Futuro Perfecto";

    // Partner is helpful. Let's make customized cute comments in Russian and Armenian mix!
    if (prob < 0.8) {
      // Gives correct answer
      const correctOptLetter = String.fromCharCode(65 + currentQuestion.options.indexOf(currentQuestion.correctAnswer));
      advice = `«Привет, ${player}! Я на 100% уверен(а), что правильный ответ — это вариант с глаголом "${currentQuestion.correctAnswer}". Давай выберем его!» («Բարև ${player}, ես համոզված եմ, որ ճիշտ պատասխանն է "${currentQuestion.correctAnswer}"-ը։»)`;
    } else {
      // Gives partial help
      const incorrectOne = currentQuestion.options.find(opt => opt !== currentQuestion.correctAnswer) || "";
      advice = `«Ой, ${player}, тут сложно! Но мне кажется, что ${incorrectOne} точно не подходит. Наверное, это связано с ${currentQuestion.tense === "Futuro Perfecto" ? "Futuro Perfecto (причастие)" : "Futuro Simple"}. Подумай хорошо!» («Արի քննարկենք, ինձ թվում է "${incorrectOne}"-ը սխալ տարբերակ է։»)`;
    }

    setPartnerAdvice(advice);
    setMLifelinesUsed(prev => ({
      ...prev,
      [player]: { ...prev[player], askPartner: true }
    }));
  };

  const useGrammarClue = () => {
    const player = getCurrentPlayer();
    if (mLifelinesUsed[player].grammarPista || mIsAnswered) return;
    sounds.playLifeline();

    setShowGrammarClue(true);
    setMLifelinesUsed(prev => ({
      ...prev,
      [player]: { ...prev[player], grammarPista: true }
    }));
  };

  // Dialogue Game logic
  const handleSelectBlank = (blankId: string) => {
    if (dSubmitted) return;
    setDSelectedBlankId(blankId);
  };

  const handlePlaceWord = (word: string) => {
    if (dSubmitted || !dSelectedBlankId) return;
    sounds.playLifeline(); // play click pitch
    setDAnswers(prev => ({
      ...prev,
      [dSelectedBlankId]: word
    }));

    // Auto navigate to the next unfilled blank to make input rapid and satisfying!
    const unfilledBlanks = RESTAURANT_DIALOGUE
      .filter(line => line.blankId)
      .map(line => line.blankId!)
      .filter(bId => bId !== dSelectedBlankId && !dAnswers[bId]);

    if (unfilledBlanks.length > 0) {
      setDSelectedBlankId(unfilledBlanks[0]);
    } else {
      // None left, clear active selection
      setDSelectedBlankId(null);
    }
  };

  const handleRemoveWord = (blankId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (dSubmitted) return;
    setDAnswers(prev => {
      const updated = { ...prev };
      delete updated[blankId];
      return updated;
    });
    setDSelectedBlankId(blankId);
  };

  const checkDialogueAnswers = () => {
    let correctCount = 0;
    const results: { [key: string]: boolean } = {};

    RESTAURANT_DIALOGUE.forEach(line => {
      if (line.blankId && line.correctWord) {
        const userWord = dAnswers[line.blankId];
        const isCorrect = userWord?.trim().toLowerCase() === line.correctWord.toLowerCase();
        results[line.blankId] = isCorrect;
        if (isCorrect) {
          correctCount++;
        }
      }
    });

    setDResults(results);
    setDScore(correctCount);
    setDSubmitted(true);

    if (correctCount === DIALOGUE_VOCABULARY.length) {
      sounds.playVictory();
    } else {
      sounds.playWrong();
    }
  };

  const resetDialogue = () => {
    setDAnswers({});
    setDSelectedBlankId("reserva");
    setDSubmitted(false);
    setDResults({});
    setDScore(0);
  };

  // Compute stats
  const totalCorrect = mScores.Gor + mScores.Gayane;
  const isGorWinner = mScores.Gor > mScores.Gayane;
  const isDraw = mScores.Gor === mScores.Gayane;

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans selection:bg-[#fbbf24] selection:text-slate-950 flex flex-col antialiased">
      {/* Absolute top bar with status/settings */}
      <header id="app-header" className="bg-[#1e293b] border-b-2 border-[#334155] py-4 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#fbbf24] to-[#6366f1] flex items-center justify-center text-slate-950 font-black text-xl shadow-md ring-2 ring-[#6366f1]/50">
            ES
          </div>
          <div>
            <h1 className="font-extrabold text-sm md:text-xl tracking-tight text-white flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#6366f1]">Aprende Español</span>
              <span className="text-[#fbbf24] text-[10px] md:text-xs px-2.5 py-0.5 rounded-full bg-[#0f172a] border border-[#334155] uppercase font-mono tracking-widest font-black">Gor & Gayane</span>
            </h1>
            <p className="text-[10px] md:text-xs text-slate-400 md:block hidden font-medium">
              Ապագա Ժամանակ (Futuro) • Իրական Երկխոսություններ Ռեստորանում
            </p>
          </div>
        </div>

        {/* Tab & Audio selectors */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex bg-[#0f172a] p-1 rounded-xl border border-[#334155]/80">
            <button
              id="tab-btn-millionaire"
              onClick={() => setActiveTab("millionaire")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "millionaire"
                  ? "bg-[#6366f1] text-white shadow-md shadow-indigo-950/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>Միլիոնատեր</span>
            </button>
            <button
              id="tab-btn-dialogue"
              onClick={() => setActiveTab("dialogue")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "dialogue"
                  ? "bg-[#6366f1] text-white shadow-md shadow-indigo-950/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-emerald-400" />
              <span>Երկխոսություն</span>
            </button>
          </div>

          <button
            id="sound-toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] text-slate-300 hover:text-white transition cursor-pointer"
            title={soundEnabled ? "Անջատել ձայնը" : "Միացնել ձայնը"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 overflow-x-hidden flex flex-col justify-start">
        {activeTab === "millionaire" ? (
          /* ========================================================== */
          /* MILLIONAIRE TRIVIA INTERFACE                              */
          /* ========================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start w-full">
            {/* Left: Interactive Game Board (3 cols) */}
            <div className="lg:col-span-3 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-3xl p-5 md:p-8 border-2 border-slate-700/60 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
              {/* Vibe header showing who is fighting whom */}
              <div className="flex flex-wrap items-center justify-between border-b-2 border-[#334155]/60 pb-5 gap-4">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg transition duration-350 border-2 shadow-md ${
                        currentPlayer === "Gor" 
                          ? "bg-[#6366f1] text-[#0f172a] border-white ring-4 ring-[#6366f1]/45 scale-105" 
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}>
                        G
                      </div>
                      {currentPlayer === "Gor" && (
                        <div className="absolute -top-1.5 -right-1.5 bg-[#fbbf24] text-[#0f172a] rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase shadow animate-bounce tracking-wide">
                          Հերթ
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-black text-xs md:text-sm text-[#6366f1] flex items-center gap-2">
                        <span>ԳՈՌ (Gor)</span>
                        <span className="text-[10px] bg-[#6366f1]/20 text-[#818cf8] px-2 py-0.5 rounded font-mono font-bold border border-[#6366f1]/35">
                          {mScores.Gor} / 15
                        </span>
                      </div>
                      <div className="text-xs font-black font-mono text-[#fbbf24]" id="gor-money">
                        ${mEarnings.Gor.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-slate-500 font-extrabold tracking-widest bg-[#0f172a] px-3 py-1 rounded-full border border-[#334155]">VS</span>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg transition duration-350 border-2 shadow-md ${
                        currentPlayer === "Gayane" 
                          ? "bg-[#ec4899] text-[#0f172a] border-white ring-4 ring-[#ec4899]/45 scale-105" 
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}>
                        G
                      </div>
                      {currentPlayer === "Gayane" && (
                        <div className="absolute -top-1.5 -right-1.5 bg-[#fbbf24] text-[#0f172a] rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase shadow animate-bounce tracking-wide">
                          Հերթ
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-black text-xs md:text-sm text-[#ec4899] flex items-center gap-2">
                        <span>ԳԱՅԱՆԵ (Gayane)</span>
                        <span className="text-[10px] bg-[#ec4899]/20 text-[#f472b6] px-2 py-0.5 rounded font-mono font-bold border border-[#ec4899]/35">
                          {mScores.Gayane} / 15
                        </span>
                      </div>
                      <div className="text-xs font-black font-mono text-[#fbbf24]" id="gayane-money">
                        ${mEarnings.Gayane.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4 bg-[#0f172a] px-4 py-2.5 rounded-2xl border border-[#334155]/65 shadow-inner">
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-extrabold tracking-widest block font-bold">Միավորներ</div>
                    <div className="font-mono text-xl font-black text-[#fbbf24]" id="question-value">
                      ${currentQuestion.difficulty.toLocaleString()}
                    </div>
                  </div>
                  <div className="border-l border-[#334155] h-8"></div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-extrabold tracking-widest block font-bold">Քերականություն</div>
                    <div className="text-xs font-black text-[#6366f1] uppercase">
                      {currentQuestion.tense}
                    </div>
                  </div>
                </div>
              </div>

              {!gameFinished ? (
                <>
                  {/* COMODINES (LIFELINES) PANEL */}
                  <div className="bg-[#0f172a]/60 p-4 rounded-2xl border border-[#334155]/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                      <Sparkles className="w-4 h-4 text-[#6366f1]" />
                      <span>Հուշումներ խաղացող <strong className="text-white underline">{currentPlayer}</strong>-ի համար:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* 1. Fifty Fifty */}
                      <button
                        id="lifeline-fifty-fifty"
                        onClick={useFiftyFifty}
                        disabled={mLifelinesUsed[currentPlayer].fiftyFifty || mIsAnswered}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition active:scale-95 ${
                          mLifelinesUsed[currentPlayer].fiftyFifty
                            ? "bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed"
                             : mIsAnswered
                             ? "border-slate-850 text-slate-500 cursor-not-allowed"
                             : "bg-[#6366f1]/15 border-[#6366f1]/50 hover:bg-[#6366f1]/30 text-white"
                        }`}
                        title="Հեռացնել 2 սխալ պատասխան"
                      >
                        <span className="font-extrabold text-[#fbbf24]">50:50</span>
                        <span>{mLifelinesUsed[currentPlayer].fiftyFifty ? "Օգտագործված" : "50:50"}</span>
                      </button>

                      {/* 2. Ask partner */}
                      <button
                        id="lifeline-ask-partner"
                        onClick={useAskPartner}
                        disabled={mLifelinesUsed[currentPlayer].askPartner || mIsAnswered}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition active:scale-95 ${
                          mLifelinesUsed[currentPlayer].askPartner
                            ? "bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed"
                            : mIsAnswered
                            ? "border-slate-850 text-slate-500 cursor-not-allowed"
                            : "bg-emerald-950/25 border-emerald-800/55 hover:bg-emerald-950/45 text-emerald-200"
                        }`}
                        title={`Հարցնել զուգընկերոջ կարծիքը: ${getPartnerName(currentPlayer)}`}
                      >
                        <Users className="w-3.5 h-3.5 text-[#fbbf24]" />
                        <span>{mLifelinesUsed[currentPlayer].askPartner ? "Օգտագործված" : `Օգնություն ${getPartnerName(currentPlayer)}-ից`}</span>
                      </button>

                      {/* 3. Grammar clue */}
                      <button
                        id="lifeline-grammar-pista"
                        onClick={useGrammarClue}
                        disabled={mLifelinesUsed[currentPlayer].grammarPista || mIsAnswered}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition active:scale-95 ${
                          mLifelinesUsed[currentPlayer].grammarPista
                            ? "bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed"
                            : mIsAnswered
                            ? "border-[#334155]/60 text-slate-500 cursor-not-allowed"
                            : "bg-amber-950/25 border-[#fbbf24]/40 hover:bg-amber-950/45 text-amber-200"
                        }`}
                        title="Քերականական բացատրություն"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#fbbf24]" />
                        <span>{mLifelinesUsed[currentPlayer].grammarPista ? "Կանոնը բացված է" : "Քերականություն"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Clue display */}
                  {partnerAdvice && (
                    <div className="bg-[#1e293b] border-2 border-sky-500/50 p-4 rounded-2xl flex items-start gap-4 animate-fade-in duration-300">
                      <div className={`w-10 h-10 rounded-full text-slate-950 flex items-center justify-center font-bold text-base shrink-0 self-center shadow ${
                        getPartnerName(currentPlayer) === "Gor" ? "bg-[#38bdf8]" : "bg-[#f472b6]"
                      }`}>
                        {getPartnerName(currentPlayer).substring(0, 1)}
                      </div>
                      <div className="text-sm md:text-base text-sky-200 italic leading-relaxed">
                        <strong className="text-white block font-bold not-italic mb-1 text-sm md:text-base">
                          Խորհուրդ {getPartnerName(currentPlayer)}-ից:
                        </strong>
                        {partnerAdvice}
                      </div>
                    </div>
                  )}

                  {showGrammarClue && (
                    <div className="bg-[#1e293b] border-2 border-[#fbbf24]/50 p-4 rounded-2xl animate-fade-in duration-300">
                      <div className="flex items-center gap-2 text-xs font-black text-[#fbbf24] mb-2">
                        <Info className="w-4 h-4" />
                        <span>ՔԵՐԱԿԱՆԱԿԱՆ ՀՈՒՇՈՒՄ:</span>
                      </div>
                      <div className="space-y-2 text-sm md:text-base leading-relaxed text-amber-200 break-words">
                        <p>{currentQuestion.explanation.am}</p>
                      </div>
                    </div>
                  )}

                  {/* QUESTION COMPONENT */}
                  <div className="bg-[#1e293b] border-2 border-[#6366f1] rounded-3xl p-6 shadow-xl flex flex-col items-center gap-4 text-center select-none relative">
                    <div className="absolute top-3 left-4 text-xs font-mono text-slate-500 tracking-wider font-bold">
                      Pregunta {currentQuestion.id} / 15
                    </div>

                    <div className="text-[#fbbf24] text-xs uppercase tracking-widest font-extrabold mt-4">
                      {currentQuestion.tense}
                    </div>

                    <div className="text-xl md:text-2xl font-black text-white px-2 mt-1 leading-snug break-words max-w-full">
                      "{currentQuestion.sentence}"
                    </div>

                    {/* Translations or multi-language clues below the sentence */}
                    <div className="w-full bg-[#0f172a] p-4 rounded-2xl border border-slate-700 text-left mt-2 shadow-inner">
                      <div className="text-sm md:text-base text-slate-200 font-medium font-sans break-words leading-relaxed">
                        <span className="font-extrabold text-[#6366f1] block border-b border-[#334155] pb-1.5 mb-2 font-mono uppercase text-[10px] tracking-wider">Թարգմանություն</span>
                        <span>{currentQuestion.armenianClue}</span>
                      </div>
                    </div>
                  </div>

                  {/* ANSWERS CONTAINER */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {currentQuestion.options.map((option, idx) => {
                      const isDisabled = fiftyFiftyDisabled.includes(option);
                      const isSelected = mSelectedAnswer === option;
                      const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

                      let buttonClass = currentPlayer === "Gor" 
                        ? "bg-[#6366f1]/5 border-[#6366f1]/30 hover:bg-[#6366f1]/15 hover:border-[#6366f1]/80 text-[#f1f5f9]"
                        : "bg-[#ec4899]/5 border-[#ec4899]/30 hover:bg-[#ec4899]/15 hover:border-[#ec4899]/80 text-[#f1f5f9]";

                      let letterBadgeClass = "bg-[#0f172a] text-[#fbbf24]";

                      if (isDisabled) {
                        buttonClass = "bg-[#0f172a]/40 opacity-15 border-[#334155]/30 cursor-not-allowed pointer-events-none";
                        letterBadgeClass = "bg-[#0f172a] text-slate-805 text-slate-700";
                      } else if (mIsAnswered) {
                        const isThisCorrect = option === currentQuestion.correctAnswer;
                        if (isThisCorrect) {
                          // Correct option glows neon emerald
                          buttonClass = "bg-emerald-950/70 border-emerald-400 text-emerald-100 ring-2 ring-[#10b981] scale-[101%] duration-150";
                          letterBadgeClass = "bg-emerald-400 text-[#0f172a] font-black";
                        } else if (isSelected) {
                          // Selected wrong option glows red
                          buttonClass = "bg-red-950/70 border-red-500 text-red-100 ring-2 ring-red-500 scale-[99%] duration-150";
                          letterBadgeClass = "bg-red-500 text-red-950 font-black";
                        } else {
                          // Other non-selected wrong options
                          buttonClass = "bg-slate-950 opacity-40 border-slate-900 cursor-not-allowed pointer-events-none";
                          letterBadgeClass = "bg-[#0f172a] text-slate-500";
                        }
                      }

                      return (
                        <button
                          id={`option-btn-${optionLetter}`}
                          key={option}
                          onClick={() => handleMillionaireAnswer(option)}
                          disabled={mIsAnswered || isDisabled}
                          className={`group text-left p-4.5 rounded-2xl border flex items-center gap-4 transition-all duration-200 text-sm font-bold cursor-pointer active:scale-[97%] shadow-md w-full ${buttonClass}`}
                        >
                          <span className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center text-xs font-mono font-black transition-all duration-200 ${letterBadgeClass}`}>
                            {optionLetter}
                          </span>
                          <span className="truncate">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* BOTTOM EXPLANATION AND NEXT BUTTON */}
                  {mIsAnswered && (
                    <div className="bg-slate-900/90 rounded-2xl p-4 md:p-5 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in w-full">
                      <div className="flex-1 flex gap-3 text-left">
                        {mIsCorrect ? (
                          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 self-start mt-0.5" />
                        ) : (
                          <XCircle className="w-8 h-8 text-red-500 shrink-0 self-start mt-0.5" />
                        )}
                        <div className="space-y-1.5 w-full font-sans">
                          <h4 className={`font-bold text-sm md:text-base ${mIsCorrect ? "text-emerald-400" : "text-red-500"}`}>
                            {mIsCorrect 
                              ? `Գերազանց է: ${currentPlayer}-ը վաստակում է $${currentQuestion.difficulty.toLocaleString()}` 
                              : `Սխալ է: Ճիշտ պատասխանն է՝ ${currentQuestion.correctAnswer}`}
                          </h4>
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans break-words font-medium">
                            {currentQuestion.explanation.es}
                          </p>
                          <div className="border-t border-slate-800/80 pt-1.5 text-xs md:text-sm text-slate-300 space-y-1 break-words">
                            <div><strong className="text-amber-400 font-bold">Հայերեն:</strong> {currentQuestion.explanation.am}</div>
                          </div>
                        </div>
                      </div>

                      <button
                        id="next-question-btn"
                        onClick={handleNextQuestion}
                        className="py-3 px-5 rounded-xl bg-indigo-600 hover:bg-[#6366f1] text-white font-extrabold text-xs md:text-sm shadow-md transition flex items-center gap-1.5 self-center md:self-end shrink-0 cursor-pointer"
                      >
                        <span>{mCurrentIndex < MILLIONAIRE_QUESTIONS.length - 1 ? "Հաջորդ հարցը" : "Մատչի արդյունքները"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* ======================== GAME OVER SCREEN ======================= */
                <div className="flex flex-col items-center text-center p-8 space-y-6 bg-slate-950/70 border-2 border-slate-800 rounded-3xl max-w-xl mx-auto my-4 shadow-2xl animate-fade-in w-full">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center animate-bounce">
                    <Trophy className="w-10 h-10" />
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Խաղն ավարտվեց:</h2>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">
                      Gor y Gayane • 15 հարց
                    </p>
                  </div>

                  {/* WINNER BOARD */}
                  <div className="w-full bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <div className="text-sm md:text-base font-bold text-slate-300">Դուելի հաղթողը`</div>
                    
                    {isDraw ? (
                      <div className="text-lg md:text-xl font-bold text-amber-400 flex items-center justify-center gap-1">
                        <Users className="w-5 h-5 text-amber-500" />
                        <span>Ոչ-ոքի: Հաղթեց ընկերությունը:</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          isGorWinner ? "bg-sky-500 text-slate-950" : "bg-emerald-500 text-slate-950"
                        }`}>
                          G
                        </div>
                        <span className={`text-xl md:text-2xl font-black ${isGorWinner ? "text-sky-400" : "text-emerald-400"}`}>
                          {isGorWinner ? "ԳՈՌԸ ՀԱՂԹԵՑ" : "ԳԱՅԱՆԵՆ ՀԱՂԹԵՑ"}! 🎉
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-sm">
                      <div className="text-center p-3 bg-slate-950 border border-slate-850 rounded-xl">
                        <div className="font-extrabold text-sky-400 text-sm md:text-base">ԳՈՌ</div>
                        <div className="font-mono text-xl font-bold text-white mt-1">{mScores.Gor} / 15</div>
                        <div className="text-[11px] text-slate-450 text-slate-400 mt-0.5 animate-pulse">Ճիշտ</div>
                        <div className="font-mono text-base font-black text-amber-500 mt-1">${mEarnings.Gor.toLocaleString()}</div>
                      </div>

                      <div className="text-center p-3 bg-slate-955 bg-slate-950 border border-slate-850 rounded-xl">
                        <div className="font-extrabold text-[#ec4899] text-sm md:text-base">ԳԱՅԱՆԵ</div>
                        <div className="font-mono text-xl font-bold text-white mt-1">{mScores.Gayane} / 15</div>
                        <div className="text-[11px] text-slate-455 text-slate-400 mt-0.5 animate-pulse">Ճիշտ</div>
                        <div className="font-mono text-base font-black text-amber-500 mt-1">${mEarnings.Gayane.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-350 italic max-w-md break-words">
                    «Շնորհավորում ենք ձեզ: Futuro Simple և Futuro Perfecto ժամանակաձևերի ուսումնասիրությունը հաջողությամբ ավարտվեց։»
                  </p>

                  <button
                    id="restart-millionaire-btn"
                    onClick={resetMillionaire}
                    className="py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-505 block w-full hover:bg-indigo-500 text-white font-extrabold transition text-xs shadow-md focus:outline-none flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Խաղալ նորից</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Millionaire Score Ladder (1 col) */}
            <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 shadow-xl flex flex-col w-full">
              <h3 className="text-xs font-black text-slate-400 mb-3 text-center uppercase tracking-widest border-b border-slate-800 pb-2 font-mono">
                Մրցանակային սանդղակ
              </h3>
              
              <div className="space-y-1 select-none flex-grow">
                {MONEY_SCALE.map((amount, idx) => {
                  const stepIndex = 15 - idx; // Question 1 = $100, Question 15 = $1,000,000
                  const isActive = mCurrentIndex === stepIndex - 1;
                  const isCompleted = mCurrentIndex >= stepIndex;
                  const targetPlayer = getCurrentPlayer(stepIndex - 1);

                  // Highlights milestones (safe zones) like step 5 ($1,000), step 10 ($32,000), step 15 ($1,000,000)
                  const isMilestone = stepIndex === 5 || stepIndex === 10 || stepIndex === 15;

                  let itemBg = "bg-transparent";
                  let textClass = "text-slate-500";
                  let amountClass = isMilestone ? "text-amber-500" : "text-amber-600/70";

                  if (isActive) {
                    itemBg = targetPlayer === "Gor"
                      ? "bg-sky-950/65 border border-sky-600/40 text-sky-200"
                      : "bg-emerald-950/65 border border-emerald-600/40 text-emerald-200";
                    textClass = "text-white font-bold scale-[102%]";
                    amountClass = "text-amber-400 font-extrabold";
                  } else if (isCompleted) {
                    itemBg = "bg-slate-900/40 text-slate-300";
                    textClass = "line-through text-slate-400";
                    amountClass = "text-amber-500/50";
                  } else if (isMilestone) {
                    textClass = "text-slate-300 font-medium";
                    amountClass = "text-amber-500 font-bold";
                  }

                  return (
                    <div
                      id={`money-step-${stepIndex}`}
                      key={amount}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-xl transition text-[11px] ${itemBg}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 w-4 block text-right">
                          {stepIndex}.
                        </span>
                        {isActive && (
                          <span className={`w-1.5 h-1.5 rounded-full ${targetPlayer === "Gor" ? "bg-sky-400 animate-ping" : "bg-emerald-400 animate-ping"}`} />
                        )}
                        <span className={textClass}>
                          {isActive ? `Հերթը՝ ${targetPlayer === "Gor" ? "Գոռ" : "Գայանե"}` : `Հարց ${stepIndex}`}
                        </span>
                      </div>
                      <span className={`font-mono font-bold ${amountClass}`}>
                        ${amount.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="sticky bottom-0 bg-slate-950 pt-2 border-t border-slate-800 text-[11px] md:text-xs text-slate-300 leading-relaxed mt-4 space-y-1 text-left">
                <p>💡 <strong className="text-white font-bold">Ինչպես է դա աշխատում:</strong></p>
                <p className="break-words font-medium">Դուք պատասխանում եք հերթով: Գոռը պատասխանում է կենտ հարցերին (1, 3, 5...), Գայանեն՝ զույգ հարցերին (2, 4, 6...): Ձեր հավաքած միավորները և գումարները գումարվում են միմյանց:</p>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* RESTAURANT DIALOGUE FILL-IN-THE-GAP PRACTICE               */
          /* ========================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start w-full">
            {/* Left Column: List of Vocabulary Words Chips (1 col) */}
            <div className="lg:col-span-1 bg-[#1e293b] rounded-3xl p-5 border-2 border-slate-700/60 shadow-xl flex flex-col sticky top-20">
              <div className="text-center border-b-2 border-slate-700/50 pb-4 mb-4">
                <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest flex items-center justify-center gap-1.5 font-mono">
                  <BookOpen className="w-4 h-4 text-emerald-400 font-bold" />
                  <span>Բառերի Բանկ</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 font-semibold leading-relaxed">
                  Ընտրեք ճիշտ բաց թողնված բառը իսպաներեն երկխոսության համար:
                </p>
              </div>

              {/* Word chips */}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {DIALOGUE_VOCABULARY.map((v) => {
                  const isUsed = Object.values(dAnswers).includes(v.word);
                  return (
                    <button
                      id={`vocab-chip-${v.word}`}
                      key={v.word}
                      disabled={dSubmitted || isUsed}
                      onClick={() => handlePlaceWord(v.word)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition select-none flex flex-col cursor-pointer duration-150 active:scale-95 ${
                        isUsed
                          ? "bg-slate-950 border-slate-900 opacity-25 text-slate-600 line-through cursor-not-allowed"
                          : dSubmitted
                          ? "bg-[#0f172a] border-slate-800 text-slate-500 cursor-not-allowed"
                          : "bg-[#0f172a] border-slate-700/50 hover:border-emerald-500 hover:bg-[#1e293b]/50 hover:shadow-md text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-sm font-black text-emerald-400">
                          {v.word}
                        </span>
                        <span className="text-[9px] bg-slate-950 px-2.5 py-0.5 rounded-full text-slate-400 font-black uppercase font-mono">
                          բառ
                        </span>
                      </div>
                      <div className="text-xs md:text-sm text-slate-350 font-bold mt-1 leading-relaxed break-words">
                        {v.translation}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Reset/Submit dialog instructions */}
              <div className="mt-4 pt-4 border-t-2 border-slate-705 border-slate-700/40 text-[11px] md:text-xs text-slate-300 space-y-2.5 leading-relaxed font-semibold">
                <p>💬 <strong className="text-white font-bold">Հրահանգներ:</strong></p>
                <ol className="list-decimal pl-4.5 space-y-1.5 text-left">
                  <li>Սեղմեք աջ երկխոսության ընդգծված դատարկ դաշտի վրա <strong>[______]</strong>։</li>
                  <li>Այնուհետև սեղմեք համապատասխան բառը այս Բառերի Բանկից։</li>
                  <li>Բոլոր դաշտերը լրացնելուց հետո, սեղմեք ներքևի <strong className="text-white">«Ստուգել երկխոսությունը»</strong> կոճակը։</li>
                </ol>
              </div>
            </div>

            {/* Right Column: Dialogue thread (3 cols) */}
            <div className="lg:col-span-3 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-3xl p-5 md:p-8 border-2 border-slate-700/60 shadow-2xl flex flex-col gap-6 relative w-full">
              
              {/* Click outside backdrop for floating dropdowns */}
              {dSelectedBlankId && !dSubmitted && (
                <div 
                  className="fixed inset-0 z-50 bg-transparent cursor-default"
                  onClick={() => setDSelectedBlankId(null)}
                />
              )}
              
              {/* Restaurant Header banner */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shadow shadow-emerald-950">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif font-black text-sm md:text-lg text-white">
                      Գործնական երկխոսություն՝ ¿Qué desea tomar?
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium leading-relaxed">
                      Երկխոսություն իսպանական «Sabores de España» ռեստորանում
                    </p>
                  </div>
                </div>

                {dSubmitted && (
                  <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl text-right shrink-0">
                    <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase">Գնահատական</span>
                    <span className="font-mono text-sm md:text-lg font-black text-amber-400">
                      {dScore} / {DIALOGUE_VOCABULARY.length} ճիշտ է
                    </span>
                  </div>
                )}
              </div>

              {/* DIALOGUE LINES LIST */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2" id="dialogue-container">
                {RESTAURANT_DIALOGUE.map((line) => {
                  const isBlank = !!line.blankId;
                  const wordAssigned = line.blankId ? dAnswers[line.blankId] : null;
                  const isActive = dSelectedBlankId === line.blankId;
                  const isSubmitted = dSubmitted;
                  const isCorrect = line.blankId ? dResults[line.blankId] : null;

                  // Styling for dialogue bubbles
                  let bubbleClass = "bg-[#0f172a] border-[#334155]";
                  let speakerClass = "text-slate-400";
                  let containerJustify = "justify-start";

                  if (line.speaker === "Camarero") { 
                    bubbleClass = "bg-emerald-950/15 border-emerald-500/35 ml-0 mr-8";
                    speakerClass = "text-emerald-400 font-black";
                  } else if (line.speaker === "Lucía") {
                    bubbleClass = "bg-[#6366f1]/10 border-[#6366f1]/35 mr-0 ml-8";
                    speakerClass = "text-[#818cf8] font-black";
                    containerJustify = "justify-end";
                  } else if (line.speaker === "Carlos") {
                    bubbleClass = "bg-[#ec4899]/10 border-[#ec4899]/35 mr-0 ml-8";
                    speakerClass = "text-[#f472b6] font-black";
                    containerJustify = "justify-end";
                  }

                  // Render text with interactive placeholders
                  const renderTextWithBlanks = () => {
                    if (!isBlank || !line.blankId) return <span>{line.text}</span>;

                    const parts = line.text.split(/\[.*?\]/);
                    return (
                      <>
                        <span>{parts[0]}</span>
                        <span
                          id={`blank-slot-${line.blankId}`}
                          onClick={() => handleSelectBlank(line.blankId!)}
                          className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-xl transition font-mono font-bold border mx-1 cursor-pointer select-none duration-150 ${
                            isSubmitted
                              ? isCorrect
                                ? "bg-emerald-950/70 border-emerald-500 text-emerald-200"
                                : "bg-red-950/70 border-red-500 text-red-200"
                              : isActive
                              ? "bg-[#6366f1] text-white border-white shadow-md ring-2 ring-[#6366f1]/50 z-50"
                              : wordAssigned
                              ? "bg-[#0f172a] text-[#fbbf24] border-slate-600 hover:border-[#6366f1]"
                              : "bg-[#0f172a]/60 border-slate-700/60 text-slate-500 hover:border-slate-450 border-dashed"
                          }`}
                        >
                          {wordAssigned ? (
                            <>
                              <span>{wordAssigned}</span>
                              {!isSubmitted && (
                                <button
                                  id={`remove-blank-${line.blankId}`}
                                  onClick={(e) => handleRemoveWord(line.blankId!, e)}
                                  className="w-4 h-4 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center text-[10px] font-black cursor-pointer active:scale-90 z-20"
                                  title="Մաքրել"
                                >
                                  ×
                                </button>
                              )}
                            </>
                          ) : (
                            <span>_____</span>
                          )}

                          {/* FLOATING WORD SELECTION DROPDOWN BELOW THE BLANK */}
                          {isActive && !isSubmitted && (
                            <span 
                              onClick={(e) => e.stopPropagation()}
                              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 md:w-72 max-w-[80vw] bg-[#0b1329] border-2 border-slate-700/80 rounded-2xl shadow-2xl p-3 z-55 flex flex-col gap-2 text-left font-sans text-xs font-normal text-slate-200 cursor-default"
                            >
                              <span className="pb-1.5 mb-0.5 border-b border-slate-800 text-[10px] font-black text-slate-400 color-slate-400 uppercase tracking-widest font-mono flex justify-between items-center select-none">
                                <span>Ընտրեք բառը • Выберите слово</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setDSelectedBlankId(null); }}
                                  className="text-slate-400 hover:text-white font-black text-sm px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 active:scale-95 transition cursor-pointer"
                                >
                                  ×
                                </button>
                              </span>
                              <span className="max-h-52 overflow-y-auto space-y-1 pr-1 flex flex-col">
                                {DIALOGUE_VOCABULARY.map((v) => {
                                  const isUsed = Object.values(dAnswers).includes(v.word);
                                  const isCurrentChoice = dAnswers[line.blankId!] === v.word;
                                  return (
                                    <span
                                      role="button"
                                      tabIndex={0}
                                      key={v.word}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (isUsed && !isCurrentChoice) return;
                                        handlePlaceWord(v.word);
                                        setDSelectedBlankId(null); // auto-close after choosing
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                          e.stopPropagation();
                                          if (isUsed && !isCurrentChoice) return;
                                          handlePlaceWord(v.word);
                                          setDSelectedBlankId(null); // auto-close after choosing
                                        }
                                      }}
                                      className={`w-full p-2.5 rounded-xl text-left border flex flex-col gap-0.5 transition active:scale-[98%] select-none ${
                                        isCurrentChoice
                                          ? "bg-[#1e293b] border-indigo-500 text-indigo-200 cursor-pointer"
                                          : isUsed
                                          ? "bg-slate-900/10 border-slate-900/20 text-slate-600 line-through opacity-40 cursor-not-allowed"
                                          : "bg-slate-900 border-slate-800 hover:border-emerald-500 hover:bg-slate-800 text-slate-100 cursor-pointer"
                                      }`}
                                    >
                                      <span className="flex justify-between items-center w-full">
                                        <span className="font-extrabold text-emerald-400 font-mono text-xs">{v.word}</span>
                                        {isCurrentChoice && <span className="text-[9px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-mono font-bold">Ընտրված է</span>}
                                        {isUsed && !isCurrentChoice && <span className="text-[9px] bg-slate-950 text-slate-500 px-2 py-0.5 rounded-full font-sans font-medium">Արդեն զբաղված</span>}
                                      </span>
                                      <span className="text-[10px] text-slate-400 leading-normal flex font-medium">{v.translation}</span>
                                    </span>
                                  );
                                })}
                              </span>
                            </span>
                          )}
                        </span>
                        <span>{parts[1]}</span>
                      </>
                    );
                  };

                  return (
                    <div key={line.id} className={`flex ${containerJustify} w-full`}>
                      <div className={`p-5 rounded-2xl border max-w-2xl shadow-md space-y-3.5 ${bubbleClass}`}>
                        
                        {/* Speaker & translations headers */}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs md:text-sm font-black font-mono tracking-wide ${speakerClass}`}>
                            {line.speaker === "Camarero" ? "🤵 ՄԱՏՈՒՑՈՂ (El Camarero)" : line.speaker === "Lucía" ? "👩 ԼՈՒՍԻԱ (Lucía Torres)" : "👨 ԿԱՐԼՈՍ (Carlos)"}
                          </span>
                          
                          {isBlank && !isSubmitted && line.hintAm && (
                            <div className="group relative">
                              <span className="text-[11px] text-[#818cf8] bg-[#0f172a] border border-[#334155]/60 px-2.5 py-0.5 rounded-lg cursor-pointer hover:text-white flex items-center gap-1 font-extrabold shadow-sm active:scale-95 transition">
                                <Lightbulb className="w-3 h-3 text-[#fbbf24]" />
                                <span>Հուշում</span>
                              </span>
                              <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-slate-950 border border-[#334155] text-xs text-slate-200 rounded-xl shadow-xl z-10 space-y-2 leading-relaxed font-sans text-left border-dashed border-sky-500">
                                <p className="font-semibold text-slate-300"><strong className="text-[#fbbf24] font-bold">Հայերեն`</strong> {line.hintAm}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Dialogue sentence */}
                        <div className="text-sm text-slate-100 font-semibold leading-relaxed">
                          {renderTextWithBlanks()}
                        </div>

                        {/* Translation footer */}
                        <div className="pt-2.5 border-t border-slate-700/40 space-y-1.5 text-xs text-slate-400 leading-relaxed font-sans text-left">
                          <div>
                            <span className="text-[9px] font-black text-[#818cf8] uppercase tracking-widest block font-mono">Հայերեն թարգմանություն</span>
                            <span className="font-bold text-slate-200 text-xs md:text-sm leading-relaxed">{line.translationAm}</span>
                          </div>
                        </div>

                        {/* Grammar feedback if submitted and incorrect */}
                        {isSubmitted && isBlank && !isCorrect && (
                          <div className="mt-2 p-2.5 bg-red-950/30 border border-red-900/50 rounded-xl text-[11px] md:text-xs text-red-300 text-left font-sans">
                            <strong className="font-bold text-red-400">Ճիշտ պատասխանն է`</strong> "{line.correctWord}" • <span className="font-semibold">{line.hintAm}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ACTION PANEL */}
              <div className="bg-[#1e293b]/55 p-4 rounded-2xl border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-4 w-full animate-fade-in shadow-lg">
                <div className="text-xs md:text-sm text-slate-300 leading-relaxed text-left font-semibold">
                  {dSubmitted ? (
                    <p className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs md:text-sm">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                      <span>Երկխոսությունն ստուգված է: Դուք ունեք {dScore} / {DIALOGUE_VOCABULARY.length} ճիշտ պատասխան:</span>
                    </p>
                  ) : (
                    <p>
                      Լրացրեք երկխոսության բոլոր <strong className="text-white font-bold">9 դատարկ դաշտերը</strong>, ապա սեղմեք ստուգման կոճակը:
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    id="reset-dialogue-btn"
                    onClick={resetDialogue}
                    className="p-3 rounded-xl border border-slate-600 hover:border-white text-slate-300 hover:text-white text-xs md:text-sm transition flex items-center gap-1 cursor-pointer active:scale-95 font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Մաքրել տվյալները</span>
                  </button>

                  <button
                    id="submit-dialogue-btn"
                    onClick={checkDialogueAnswers}
                    disabled={dSubmitted}
                    className={`py-3 px-5 rounded-xl font-black text-xs md:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      dSubmitted
                        ? "bg-[#0f172a] border border-[#334155]/60 text-slate-500 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ստուգել երկխոսությունը</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-955 bg-slate-950 py-4 border-t border-slate-800 mt-12 text-center text-slate-400 text-xs">
        <p>© {new Date().getFullYear()} Aprende Español: Gor y Gayane / Գոռ և Գայանե</p>
      </footer>
    </div>
  );
}
