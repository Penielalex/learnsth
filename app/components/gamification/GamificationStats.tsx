"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, Star, Zap } from "lucide-react";

interface GamificationStatsProps {
  xp: number;
  level: number;
  streak: number;
  progress: {
    percentage: number;
    xpInLevel: number;
    xpForNextLevel: number;
  };
}

export default function GamificationStats({ xp, level, streak, progress }: GamificationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {/* Level Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brown-dark/40 border border-brown-light/30 rounded-2xl p-5 flex items-center gap-4 shadow-xl"
      >
        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center border border-gold/40">
          <Star className="text-gold" size={24} fill="currentColor" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold">Level {level}</p>
          <div className="h-2 w-full bg-brown-light/20 rounded-full mt-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              className="h-full bg-gold"
            />
          </div>
          <p className="text-[10px] text-foreground/40 mt-1">{progress.xpInLevel} / {progress.xpForNextLevel} XP to next level</p>
        </div>
      </motion.div>

      {/* Streak Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-brown-dark/40 border border-brown-light/30 rounded-2xl p-5 flex items-center gap-4 shadow-xl"
      >
        <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/40">
          <Flame className="text-orange-500" size={24} fill="currentColor" />
        </div>
        <div>
          <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold">Streak</p>
          <p className="text-2xl font-black text-white">{streak} Days</p>
        </div>
      </motion.div>

      {/* Total XP Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-brown-dark/40 border border-brown-light/30 rounded-2xl p-5 flex items-center gap-4 shadow-xl"
      >
        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/40">
          <Zap className="text-purple-500" size={24} fill="currentColor" />
        </div>
        <div>
          <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold">Total XP</p>
          <p className="text-2xl font-black text-white">{xp.toLocaleString()}</p>
        </div>
      </motion.div>
    </div>
  );
}
