import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import TicTacToe from "@/components/TicTacToe";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <div>
          <h1 className="text-sm font-semibold tracking-wide">TicTacToe</h1>
          {user?.name && (
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">
              Playing as {user.name}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="cursor-pointer gap-2 text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="size-3.5" />
          Sign out
        </Button>
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
