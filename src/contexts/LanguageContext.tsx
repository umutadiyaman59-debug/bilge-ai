import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'tr' | 'en';

interface Translations {
  // App
  appName: string;
  appDescription: string;

  // Sidebar
  newChat: string;
  noChats: string;
  clearAll: string;
  export: string;
  lightMode: string;
  darkMode: string;
  settings: string;
  today: string;
  yesterday: string;
  daysAgo: string;

  // Chat
  typeMessage: string;
  aiDisclaimer: string;
  welcomeTitle: string;
  welcomeDescription: string;
  poweredBy: string;

  // Examples
  dailyChat: string;
  dailyChatPrompt: string;
  problemSolving: string;
  problemSolvingPrompt: string;
  learning: string;
  learningPrompt: string;

  // Onboarding
  onboardingTitle1: string;
  onboardingDesc1: string;
  onboardingTitle2: string;
  onboardingDesc2: string;
  onboardingTitle3: string;
  onboardingDesc3: string;
  next: string;
  start: string;

  // Settings
  settingsTitle: string;
  settingsDescription: string;
  appearance: string;
  light: string;
  dark: string;
  language: string;
  turkish: string;
  english: string;
  dataManagement: string;
  exportChats: string;
  deleteAllChats: string;
  deleteConfirm: string;
  about: string;
  version: string;
  apiSettings: string;
  apiKey: string;
  apiKeyPlaceholder: string;
  model: string;
  systemPrompt: string;
  systemPromptPlaceholder: string;
  save: string;
  saved: string;

  // Export
  exportPDF: string;
  exportJSON: string;
}

const translations: Record<Language, Translations> = {
  tr: {
    appName: 'Bilge',
    appDescription: 'Türkiye\'nin ilk yerli yapay zeka asistanı',

    newChat: 'Yeni Sohbet',
    noChats: 'Henüz sohbet yok',
    clearAll: 'Tümünü Temizle',
    export: 'Dışa Aktar',
    lightMode: 'Açık Mod',
    darkMode: 'Koyu Mod',
    settings: 'Ayarlar',
    today: 'Bugün',
    yesterday: 'Dün',
    daysAgo: 'gün önce',

    typeMessage: 'Mesajınızı yazın…',
    aiDisclaimer: 'Bilge hata yapabilir. Önemli bilgileri doğrulamayı unutmayın.',
    welcomeTitle: 'Bilge\'ye Hoş Geldiniz',
    welcomeDescription: 'Türkçe yapay zeka asistanınız. Sorularınızı yanıtlamak ve size yardımcı olmak için buradayım.',
    poweredBy: 'Yapay zeka ile güçlendirildi',

    dailyChat: 'Günlük konuşma',
    dailyChatPrompt: 'Merhaba! Bugün nasıl yardımcı olabilirsin?',
    problemSolving: 'Problem çözme',
    problemSolvingPrompt: 'Bir iş sunumu hazırlamam gerekiyor. Nereden başlamalıyım?',
    learning: 'Bilgi edinme',
    learningPrompt: 'Yapay zeka nedir ve günlük hayatımızı nasıl etkiliyor?',

    onboardingTitle1: 'Bilge\'ye Hoş Geldiniz',
    onboardingDesc1: 'Türkçe yapay zeka asistanınız Bilge, sorularınızı yanıtlamak ve günlük işlerinizde size yardımcı olmak için tasarlandı.',
    onboardingTitle2: 'Doğal Konuşma',
    onboardingDesc2: 'Bilge ile Türkçe olarak doğal bir şekilde sohbet edebilirsiniz. Sorularınızı yazın ve anında yanıt alın.',
    onboardingTitle3: 'Akıllı Yardım',
    onboardingDesc3: 'Metin yazımı, problem çözme, bilgi edinme ve daha fazlası için Bilge\'den yardım alabilirsiniz.',
    next: 'İleri',
    start: 'Başla',

    settingsTitle: 'Ayarlar',
    settingsDescription: 'Bilge uygulamasını özelleştirin',
    appearance: 'Görünüm',
    light: 'Açık',
    dark: 'Koyu',
    language: 'Dil',
    turkish: 'Türkçe',
    english: 'English',
    dataManagement: 'Veri Yönetimi',
    exportChats: 'Sohbetleri Dışa Aktar',
    deleteAllChats: 'Tüm Sohbetleri Sil',
    deleteConfirm: 'Tüm sohbetleri silmek istediğinizden emin misiniz?',
    about: 'Hakkında',
    version: 'Sürüm',
    apiSettings: 'API Ayarları',
    apiKey: 'API Anahtarı',
    apiKeyPlaceholder: 'sk-ant-...',
    model: 'Model',
    systemPrompt: 'Sistem Talimatı',
    systemPromptPlaceholder: 'Bilge\'nin kişiliğini ve davranışını tanımlayın...',
    save: 'Kaydet',
    saved: 'Kaydedildi!',

    exportPDF: 'PDF Olarak İndir',
    exportJSON: 'JSON Olarak İndir',
  },
  en: {
    appName: 'Bilge',
    appDescription: 'Turkey\'s first native AI assistant',

    newChat: 'New Chat',
    noChats: 'No chats yet',
    clearAll: 'Clear All',
    export: 'Export',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    settings: 'Settings',
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: 'days ago',

    typeMessage: 'Type your message…',
    aiDisclaimer: 'Bilge can make mistakes. Please verify important information.',
    welcomeTitle: 'Welcome to Bilge',
    welcomeDescription: 'Your AI assistant. I\'m here to answer your questions and help you.',
    poweredBy: 'Powered by AI',

    dailyChat: 'Daily conversation',
    dailyChatPrompt: 'Hello! How can you help me today?',
    problemSolving: 'Problem solving',
    problemSolvingPrompt: 'I need to prepare a business presentation. Where should I start?',
    learning: 'Learning',
    learningPrompt: 'What is artificial intelligence and how does it affect our daily lives?',

    onboardingTitle1: 'Welcome to Bilge',
    onboardingDesc1: 'Bilge, your AI assistant, is designed to answer your questions and help you with your daily tasks.',
    onboardingTitle2: 'Natural Conversation',
    onboardingDesc2: 'You can chat naturally with Bilge. Type your questions and get instant responses.',
    onboardingTitle3: 'Smart Help',
    onboardingDesc3: 'Get help from Bilge for text writing, problem solving, learning, and more.',
    next: 'Next',
    start: 'Start',

    settingsTitle: 'Settings',
    settingsDescription: 'Customize Bilge application',
    appearance: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    turkish: 'Türkçe',
    english: 'English',
    dataManagement: 'Data Management',
    exportChats: 'Export Chats',
    deleteAllChats: 'Delete All Chats',
    deleteConfirm: 'Are you sure you want to delete all chats?',
    about: 'About',
    version: 'Version',
    apiSettings: 'API Settings',
    apiKey: 'API Key',
    apiKeyPlaceholder: 'sk-ant-...',
    model: 'Model',
    systemPrompt: 'System Prompt',
    systemPromptPlaceholder: 'Define Bilge\'s personality and behavior...',
    save: 'Save',
    saved: 'Saved!',

    exportPDF: 'Download as PDF',
    exportJSON: 'Download as JSON',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('bilge-language');
    if (stored === 'tr' || stored === 'en') return stored;
    return 'tr';
  });

  useEffect(() => {
    localStorage.setItem('bilge-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
