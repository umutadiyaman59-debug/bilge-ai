import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'tr' | 'en';

export interface Settings {
	theme: Theme;
	language: Language;
	sendOnEnter: boolean;
	showTimestamps: boolean;
	enableNotifications: boolean;
	systemPrompt: string;
	fontSize: 'small' | 'medium' | 'large';
}

const defaultSettings: Settings = {
	theme: 'system',
	language: 'tr',
	sendOnEnter: true,
	showTimestamps: true,
	enableNotifications: true,
	systemPrompt: '',
	fontSize: 'medium'
};

function getStoredSettings(): Settings {
	if (!browser) return defaultSettings;

	const stored = localStorage.getItem('bilge-settings');
	if (stored) {
		try {
			return { ...defaultSettings, ...JSON.parse(stored) };
		} catch {
			return defaultSettings;
		}
	}
	return defaultSettings;
}

function createSettingsStore() {
	const { subscribe, set, update } = writable<Settings>(getStoredSettings());

	return {
		subscribe,

		updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => {
			update((settings) => {
				const newSettings = { ...settings, [key]: value };
				if (browser) {
					localStorage.setItem('bilge-settings', JSON.stringify(newSettings));
				}
				return newSettings;
			});
		},

		setTheme: (theme: Theme) => {
			update((settings) => {
				const newSettings = { ...settings, theme };
				if (browser) {
					localStorage.setItem('bilge-settings', JSON.stringify(newSettings));
					applyTheme(theme);
				}
				return newSettings;
			});
		},

		setLanguage: (language: Language) => {
			update((settings) => {
				const newSettings = { ...settings, language };
				if (browser) {
					localStorage.setItem('bilge-settings', JSON.stringify(newSettings));
				}
				return newSettings;
			});
		},

		reset: () => {
			set(defaultSettings);
			if (browser) {
				localStorage.setItem('bilge-settings', JSON.stringify(defaultSettings));
				applyTheme(defaultSettings.theme);
			}
		}
	};
}

export function applyTheme(theme: Theme) {
	if (!browser) return;

	const root = document.documentElement;
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

	if (theme === 'system') {
		root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
	} else {
		root.setAttribute('data-theme', theme);
	}
}

export const settingsStore = createSettingsStore();

// Initialize theme on load
if (browser) {
	const settings = getStoredSettings();
	applyTheme(settings.theme);

	// Listen for system theme changes
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		settingsStore.subscribe((settings) => {
			if (settings.theme === 'system') {
				applyTheme('system');
			}
		})();
	});
}

// Translations
export const translations = {
	tr: {
		appName: 'Bilge',
		tagline: "Türkiye'nin İlk Yerli Yapay Zekası",
		newChat: 'Yeni Sohbet',
		settings: 'Ayarlar',
		clearChat: 'Sohbeti Temizle',
		exportPdf: "PDF'e Aktar",
		typeMessage: 'Mesajınızı yazın...',
		send: 'Gönder',
		theme: 'Tema',
		language: 'Dil',
		light: 'Açık',
		dark: 'Koyu',
		system: 'Sistem',
		turkish: 'Türkçe',
		english: 'İngilizce',
		sendOnEnter: 'Enter ile Gönder',
		showTimestamps: 'Zaman Damgalarını Göster',
		notifications: 'Bildirimler',
		customInstructions: 'Özel Talimatlar',
		customInstructionsPlaceholder: 'Bilge\'ye her sohbette hatırlamasını istediğiniz şeyleri yazın...',
		fontSize: 'Yazı Boyutu',
		small: 'Küçük',
		medium: 'Orta',
		large: 'Büyük',
		resetSettings: 'Ayarları Sıfırla',
		conversations: 'Sohbetler',
		noConversations: 'Henüz sohbet yok',
		today: 'Bugün',
		yesterday: 'Dün',
		thisWeek: 'Bu Hafta',
		older: 'Daha Eski',
		thinking: 'Düşünüyor...',
		errorOccurred: 'Bir hata oluştu',
		retry: 'Tekrar Dene',
		copy: 'Kopyala',
		copied: 'Kopyalandı!',
		welcomeTitle: "Bilge'ye Hoş Geldiniz",
		welcomeSubtitle: "Türkiye'nin ilk yerli yapay zeka asistanı ile tanışın",
		welcomeDescription: 'Sorularınızı sorun, fikirlerinizi paylaşın veya yardım isteyin. Bilge her konuda size yardımcı olmak için burada.',
		getStarted: 'Başlayın',
		examplePrompts: 'Örnek Sorular',
		example1: 'Türk mutfağının en popüler yemekleri nelerdir?',
		example2: 'Bir Python programı yazmama yardım eder misin?',
		example3: 'İstanbul\'un tarihi hakkında bilgi ver',
		about: 'Hakkında',
		privacy: 'Gizlilik',
		terms: 'Şartlar'
	},
	en: {
		appName: 'Bilge',
		tagline: "Turkey's First Native AI",
		newChat: 'New Chat',
		settings: 'Settings',
		clearChat: 'Clear Chat',
		exportPdf: 'Export to PDF',
		typeMessage: 'Type your message...',
		send: 'Send',
		theme: 'Theme',
		language: 'Language',
		light: 'Light',
		dark: 'Dark',
		system: 'System',
		turkish: 'Turkish',
		english: 'English',
		sendOnEnter: 'Send on Enter',
		showTimestamps: 'Show Timestamps',
		notifications: 'Notifications',
		customInstructions: 'Custom Instructions',
		customInstructionsPlaceholder: 'Tell Bilge things you want it to remember in every chat...',
		fontSize: 'Font Size',
		small: 'Small',
		medium: 'Medium',
		large: 'Large',
		resetSettings: 'Reset Settings',
		conversations: 'Conversations',
		noConversations: 'No conversations yet',
		today: 'Today',
		yesterday: 'Yesterday',
		thisWeek: 'This Week',
		older: 'Older',
		thinking: 'Thinking...',
		errorOccurred: 'An error occurred',
		retry: 'Retry',
		copy: 'Copy',
		copied: 'Copied!',
		welcomeTitle: 'Welcome to Bilge',
		welcomeSubtitle: "Meet Turkey's first native AI assistant",
		welcomeDescription: 'Ask questions, share your ideas, or request help. Bilge is here to assist you with anything.',
		getStarted: 'Get Started',
		examplePrompts: 'Example Questions',
		example1: 'What are the most popular dishes in Turkish cuisine?',
		example2: 'Can you help me write a Python program?',
		example3: "Tell me about Istanbul's history",
		about: 'About',
		privacy: 'Privacy',
		terms: 'Terms'
	}
};

export function t(key: keyof typeof translations.tr, language: Language = 'tr'): string {
	return translations[language][key] || key;
}
