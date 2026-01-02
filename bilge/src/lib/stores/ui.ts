import { writable } from 'svelte/store';

export interface UIState {
	sidebarOpen: boolean;
	settingsOpen: boolean;
	showOnboarding: boolean;
	isMobile: boolean;
	toasts: Toast[];
}

export interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	duration?: number;
}

const initialState: UIState = {
	sidebarOpen: true,
	settingsOpen: false,
	showOnboarding: true,
	isMobile: false,
	toasts: []
};

function createUIStore() {
	const { subscribe, set, update } = writable<UIState>(initialState);

	return {
		subscribe,

		toggleSidebar: () => {
			update((state) => ({ ...state, sidebarOpen: !state.sidebarOpen }));
		},

		setSidebarOpen: (open: boolean) => {
			update((state) => ({ ...state, sidebarOpen: open }));
		},

		toggleSettings: () => {
			update((state) => ({ ...state, settingsOpen: !state.settingsOpen }));
		},

		setSettingsOpen: (open: boolean) => {
			update((state) => ({ ...state, settingsOpen: open }));
		},

		completeOnboarding: () => {
			update((state) => ({ ...state, showOnboarding: false }));
			if (typeof window !== 'undefined') {
				localStorage.setItem('bilge-onboarding-complete', 'true');
			}
		},

		checkOnboarding: () => {
			if (typeof window !== 'undefined') {
				const complete = localStorage.getItem('bilge-onboarding-complete');
				if (complete === 'true') {
					update((state) => ({ ...state, showOnboarding: false }));
				}
			}
		},

		setMobile: (isMobile: boolean) => {
			update((state) => ({
				...state,
				isMobile,
				sidebarOpen: isMobile ? false : state.sidebarOpen
			}));
		},

		showToast: (message: string, type: Toast['type'] = 'info', duration = 3000) => {
			const id = crypto.randomUUID();

			update((state) => ({
				...state,
				toasts: [...state.toasts, { id, message, type, duration }]
			}));

			if (duration > 0) {
				setTimeout(() => {
					update((state) => ({
						...state,
						toasts: state.toasts.filter((t) => t.id !== id)
					}));
				}, duration);
			}

			return id;
		},

		dismissToast: (id: string) => {
			update((state) => ({
				...state,
				toasts: state.toasts.filter((t) => t.id !== id)
			}));
		}
	};
}

export const uiStore = createUIStore();

// Check for mobile on load
if (typeof window !== 'undefined') {
	const checkMobile = () => {
		uiStore.setMobile(window.innerWidth < 768);
	};

	checkMobile();
	window.addEventListener('resize', checkMobile);
}
