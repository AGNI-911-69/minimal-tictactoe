import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-8"
    >
      <p className="text-6xl font-light mb-4">404</p>
      <p className="text-sm text-muted-foreground mb-8">Oops, this page doesn't exist</p>
      <button
        onClick={() => navigate("/")}
        className="text-xs uppercase tracking-widest text-muted-foreground/60 hover:text-foreground transition-colors duration-200 cursor-pointer"
      >
        Back to home
      </button>
    </motion.div>
  );
}
