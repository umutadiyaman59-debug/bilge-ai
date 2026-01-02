import React from 'react';
import { MessageCircle, Brain, Code, Lightbulb } from 'lucide-react';
import { BilgeLogo } from '@/components/BilgeLogo';

interface EmptyStateProps {
  onExampleClick: (message: string) => void;
}

const examples = [
  {
    icon: MessageCircle,
    prompt: "Merhaba! Bugün nasıl yardımcı olabilirsin?",
  },
  {
    icon: Brain,
    prompt: "Bir iş sunumu hazırlamam gerekiyor. Nereden başlamalıyım?",
  },
  {
    icon: Code,
    prompt: "Python'da bir web scraper nasıl yazılır?",
  },
  {
    icon: Lightbulb,
    prompt: "Bir startup için yaratıcı isim önerileri verir misin?",
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onExampleClick }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {/* ChatGPT style centered greeting */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-6">
          <BilgeLogo size="md" />
        </div>
        <h1 className="text-2xl md:text-3xl font-medium text-foreground">
          Sen hazır olduğunda hazırım.
        </h1>
      </div>

      {/* Minimal example prompts - ChatGPT style */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-2">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onExampleClick(example.prompt)}
            className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-transparent hover:bg-accent/50 transition-all duration-200 text-left"
          >
            <example.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground line-clamp-1 transition-colors">
              {example.prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
