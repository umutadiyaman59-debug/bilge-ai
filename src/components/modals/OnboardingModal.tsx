import React, { useState } from 'react';
import { Bot, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: Bot,
    title: "Bilge'ye Hoş Geldiniz",
    description: "Türkçe yapay zeka asistanınız Bilge, sorularınızı yanıtlamak ve günlük işlerinizde size yardımcı olmak için tasarlandı.",
  },
  {
    icon: MessageSquare,
    title: "Doğal Konuşma",
    description: "Bilge ile Türkçe olarak doğal bir şekilde sohbet edebilirsiniz. Sorularınızı yazın ve anında yanıt alın.",
  },
  {
    icon: Sparkles,
    title: "Akıllı Yardım",
    description: "Metin yazımı, problem çözme, bilgi edinme ve daha fazlası için Bilge'den yardım alabilirsiniz.",
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ open, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4">
            <Icon className="h-8 w-8" />
          </div>
          <DialogTitle className="text-xl">{step.title}</DialogTitle>
          <DialogDescription className="text-base">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 py-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        <Button onClick={handleNext} className="w-full gap-2">
          {currentStep < steps.length - 1 ? (
            <>
              İleri
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            "Başla"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
