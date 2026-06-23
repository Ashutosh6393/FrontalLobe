import {
  Zap,
  Hash,
  BookOpen,
  Grid3x3,
  Brain,
  type LucideIcon,
} from "lucide-react";

export type Game = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Enabled games are playable. All false this slice — placeholders only. */
  enabled: boolean;
};

export const games: Game[] = [
  {
    id: "reaction-time",
    label: "Reaction Time",
    description: "Test your visual reflexes.",
    icon: Zap,
    enabled: false,
  },
  {
    id: "number-memory",
    label: "Number Memory",
    description: "Remember the longest number you can.",
    icon: Hash,
    enabled: false,
  },
  {
    id: "verbal-memory",
    label: "Verbal Memory",
    description: "Keep as many words in short-term memory as you can.",
    icon: BookOpen,
    enabled: false,
  },
  {
    id: "pattern-recognition",
    label: "Pattern Recognition",
    description: "Spot and recall visual patterns.",
    icon: Grid3x3,
    enabled: false,
  },
  {
    id: "reasoning",
    label: "Reasoning",
    description: "Solve logic problems against the clock.",
    icon: Brain,
    enabled: false,
  },
];
