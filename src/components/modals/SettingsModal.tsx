import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Bell,
  Sliders,
  AppWindow,
  Database,
  Shield,
  Users,
  User,
  X,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Globe,
  Volume2,
  Play,
  Trash2,
  Download,
  FileText,
  Key,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { OPENAI_MODELS, setOpenAIModel, getSelectedOpenAIModel } from '@/services/openai-api';
import { TurkishFlag } from '@/components/TurkishFlag';
import { BilgeLogo } from '@/components/BilgeLogo';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onClearAll: () => void;
  onExport: () => void;
  onExportPDF?: () => void;
}

type SettingsTab = 'genel' | 'bildirimler' | 'kisiselleştirme' | 'uygulamalar' | 'veri' | 'guvenlik' | 'hesap';

const menuItems: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'genel', label: 'Genel', icon: Settings },
  { id: 'bildirimler', label: 'Bildirimler', icon: Bell },
  { id: 'kisiselleştirme', label: 'Kişiselleştirme', icon: Sliders },
  { id: 'uygulamalar', label: 'Uygulamalar', icon: AppWindow },
  { id: 'veri', label: 'Veri kontrolleri', icon: Database },
  { id: 'guvenlik', label: 'Güvenlik', icon: Shield },
  { id: 'hesap', label: 'Hesap', icon: User },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  onClearAll,
  onExport,
  onExportPDF,
}) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('genel');
  const [selectedModel, setSelectedModelState] = useState(getSelectedOpenAIModel());
  const [language, setLanguage] = useState(() => localStorage.getItem('bilge-language') || 'tr');
  const [spokenLanguage, setSpokenLanguage] = useState('tr');
  const [selectedVoice, setSelectedVoice] = useState('Ember');
  const [separateVoiceMode, setSeparateVoiceMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  // User info
  const userEmail = user?.email || 'Kullanici';
  const userInitial = userEmail.charAt(0).toUpperCase();
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR') : '';

  const handleSignOut = async () => {
    await signOut();
    onClose();
    navigate('/');
  };

  const handleClearAll = () => {
    if (confirm('Tüm sohbetleri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
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

  const handleThemeChange = (value: string) => {
    if (value === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    } else {
      setTheme(value as 'light' | 'dark');
    }
    localStorage.setItem('bilge-theme-preference', value);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'genel':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Genel</h2>

            {/* Görünüm */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Görünüm</p>
              </div>
              <Select
                value={localStorage.getItem('bilge-theme-preference') || 'system'}
                onValueChange={handleThemeChange}
              >
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Sistem
                    </div>
                  </SelectItem>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Açık
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Koyu
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vurgu rengi */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Vurgu rengi</p>
              </div>
              <Select defaultValue="default">
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-600" />
                      Varsayılan
                    </div>
                  </SelectItem>
                  <SelectItem value="blue">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      Mavi
                    </div>
                  </SelectItem>
                  <SelectItem value="green">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      Yeşil
                    </div>
                  </SelectItem>
                  <SelectItem value="red">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      Kırmızı
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dil */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Dil</p>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Otomatik algıla</SelectItem>
                  <SelectItem value="tr">Türkçe</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Konuşulan dil */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Konuşulan dil</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  En iyi sonucu almak için ana dilini seç. Listede görünmüyorsa da otomatik algılama yoluyla desteklenebilir.
                </p>
              </div>
              <Select value={spokenLanguage} onValueChange={setSpokenLanguage}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Otomatik algıla</SelectItem>
                  <SelectItem value="tr">Türkçe</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ses */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Ses</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Play className="h-3 w-3" />
                  Oynat
                </Button>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger className="w-28 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ember">Ember</SelectItem>
                    <SelectItem value="Cove">Cove</SelectItem>
                    <SelectItem value="Maple">Maple</SelectItem>
                    <SelectItem value="Breeze">Breeze</SelectItem>
                    <SelectItem value="Juniper">Juniper</SelectItem>
                    <SelectItem value="Sol">Sol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Ayrı ses modu */}
            <div className="flex items-center justify-between py-3">
              <div className="flex-1 pr-4">
                <p className="text-sm font-medium">Ayrı ses modu</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Gerçek zamanlı metin deşifreleri ve görseller olmadan Bilge Ses'i ayrı bir tam ekranda tut.
                </p>
              </div>
              <Switch
                checked={separateVoiceMode}
                onCheckedChange={setSeparateVoiceMode}
              />
            </div>
          </div>
        );

      case 'bildirimler':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Bildirimler</h2>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Bildirimler</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Yeni mesajlar ve güncellemeler için bildirim al
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Ses efektleri</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mesaj gönderme ve alma seslerini çal
                </p>
              </div>
              <Switch
                checked={soundEffects}
                onCheckedChange={setSoundEffects}
              />
            </div>
          </div>
        );

      case 'kisiselleştirme':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Kişiselleştirme</h2>

            {/* Model Selection */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Yapay Zeka Modeli</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Yanıtlar için kullanılacak AI modelini seç
                </p>
              </div>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger className="w-48 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(OPENAI_MODELS).map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        {model.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Özel talimatlar</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Bilge'nin yanıtlarını kişiselleştir
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-9">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Hafıza</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Bilge'nin seni hatırlamasına izin ver
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        );

      case 'uygulamalar':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Uygulamalar</h2>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Bağlı uygulamalar</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Bilge ile entegre çalışan uygulamaları yönet
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-9">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <AppWindow className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Henüz bağlı uygulama yok</p>
            </div>
          </div>
        );

      case 'veri':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Veri kontrolleri</h2>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Sohbet geçmişi</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tüm sohbetlerini dışa aktar
                </p>
              </div>
              <Button variant="outline" size="sm" className="h-9 gap-2" onClick={onExport}>
                <Download className="h-4 w-4" />
                JSON
              </Button>
            </div>

            {onExportPDF && (
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">PDF olarak kaydet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Mevcut sohbeti PDF formatında indir
                  </p>
                </div>
                <Button variant="outline" size="sm" className="h-9 gap-2" onClick={onExportPDF}>
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-destructive">Tüm sohbetleri sil</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Bu işlem geri alınamaz
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleClearAll}
              >
                <Trash2 className="h-4 w-4" />
                Sil
              </Button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Model eğitimini iyileştir</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sohbetlerinin modeli iyileştirmek için kullanılmasına izin ver
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        );

      case 'guvenlik':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Güvenlik</h2>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">API Anahtarı</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Kendi API anahtarınızı kullanın
                </p>
              </div>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Key className="h-4 w-4" />
                Yapılandır
              </Button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">İki faktörlü kimlik doğrulama</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Hesabını ek güvenlik katmanıyla koru
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Aktif oturumlar</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Hesabınızın bağlı olduğu cihazları yönetin
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-9">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'hesap':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Hesap</h2>

            {/* User info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-xl font-semibold text-white">{userInitial}</span>
              </div>
              <div>
                <p className="font-medium">{userEmail}</p>
                <p className="text-sm text-muted-foreground">Kisisel hesap</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">E-posta</p>
                <p className="text-xs text-muted-foreground mt-0.5">{userEmail}</p>
              </div>
              <Button variant="ghost" size="sm" className="h-9">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {createdAt && (
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">Kayit Tarihi</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{createdAt}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Abonelik</p>
                <p className="text-xs text-muted-foreground mt-0.5">Ucretsiz plan</p>
              </div>
              <Button variant="outline" size="sm" className="h-9">
                Yukselt
              </Button>
            </div>

            {/* Sign Out */}
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full h-10 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Cikis Yap
              </Button>
            </div>

            {/* About Bilge */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50">
                <BilgeLogo size="sm" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">Bilge v1.0</p>
                    <TurkishFlag size="xs" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Turkiye'nin ilk yerli yapay zeka asistani
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[600px] p-0 gap-0 overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-56 bg-muted/30 border-r border-border flex flex-col">
            {/* Close button */}
            <div className="p-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Menu items */}
            <nav className="flex-1 px-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5",
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
