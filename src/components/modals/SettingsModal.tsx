import React, { useState } from 'react';
import { Moon, Sun, Trash2, Download, Info, FileText, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { OPENAI_MODELS, setOpenAIModel, getSelectedOpenAIModel } from '@/services/openai-api';
import { TurkishFlag } from '@/components/TurkishFlag';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onClearAll: () => void;
  onExport: () => void;
  onExportPDF?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  onClearAll,
  onExport,
  onExportPDF,
}) => {
  const { theme, setTheme } = useTheme();
  const [selectedModel, setSelectedModelState] = useState(getSelectedOpenAIModel());
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('bilge-language') || 'tr';
  });

  const handleClearAll = () => {
    if (confirm('Tüm sohbetleri silmek istediğinizden emin misiniz?')) {
      onClearAll();
      onClose();
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModelState(model);
    setOpenAIModel(model);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem('bilge-language', value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ayarlar</DialogTitle>
          <DialogDescription>
            Bilge uygulamasını özelleştirin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Yapay Zeka Modeli</label>
            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Model seçin" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(OPENAI_MODELS).map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Dil
            </label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Dil seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tr">Türkçe</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Görünüm</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className={cn(
                  "justify-start gap-2",
                  theme === 'light' && "border-primary bg-primary/5"
                )}
                onClick={() => setTheme('light')}
              >
                <Sun className="h-4 w-4" />
                Açık
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "justify-start gap-2",
                  theme === 'dark' && "border-primary bg-primary/5"
                )}
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-4 w-4" />
                Koyu
              </Button>
            </div>
          </div>

          {/* Data */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Veri Yönetimi</label>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={onExport}
              >
                <Download className="h-4 w-4" />
                Sohbetleri Dışa Aktar (JSON)
              </Button>
              {onExportPDF && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={onExportPDF}
                >
                  <FileText className="h-4 w-4" />
                  Mevcut Sohbeti PDF Olarak Kaydet
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={handleClearAll}
              >
                <Trash2 className="h-4 w-4" />
                Tüm Sohbetleri Sil
              </Button>
            </div>
          </div>

          {/* About */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Hakkında</label>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-red-50 to-slate-50 dark:from-red-950/30 dark:to-slate-900/50 border border-red-100 dark:border-red-900/30">
              <TurkishFlag size="md" />
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-1">Bilge v1.0</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Türkiye'nin ilk yerli yapay zeka asistanı. Türk mühendisler tarafından geliştirildi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
