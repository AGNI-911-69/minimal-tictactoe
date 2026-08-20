import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import TicTacToe from "@/components/TicTacToe";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Home
        </button>
        <h1 className="text-sm font-semibold tracking-wide">TicTacToe</h1>
      </header>

      <div className="w-full max-w-6xl mx-auto px-8">
        <div className="w-full h-px bg-border" />
      </div>

      {/* Game */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex items-center justify-center px-8 py-12"
      >
        <TicTacToe />
      </motion.div>
    </main>
  );
}
