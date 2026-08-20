import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <div className="text-sm font-semibold tracking-wide">
          TicTacToe
        </div>
        <button
          onClick={() => navigate("/auth")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
        >
          Let's play
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-center"
        >
          {/* Minimalist board preview */}
          <div className="mx-auto mb-16 w-36 h-36 grid grid-cols-3 gap-[2px] opacity-15">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-foreground/20 rounded-sm" />
            ))}
          </div>

          <h1 className="text-5xl sm:text-6xl font-light tracking-tight leading-tight mb-6">
            Your next favorite<br />game awaits.
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-md mx-auto">
            A clean, friendly place to play tic tac toe. Challenge the computer, 
            sharpen your skills, and have a little fun along the way.
          </p>

          <button
            onClick={() => navigate("/auth")}
            className="group inline-flex items-center gap-3 px-8 py-3.5 bg-foreground text-background text-sm font-medium rounded-sm hover:bg-foreground/90 transition-all duration-200 cursor-pointer"
          >
            Start playing
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-8 text-center">
        <div className="w-12 h-px bg-border mx-auto mb-6" />
        <p className="text-xs text-muted-foreground/50 tracking-wide">
          Made with care. Played with joy.
        </p>
      </footer>
    </div>
  );
}
