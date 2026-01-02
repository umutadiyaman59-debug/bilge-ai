import { writable, derived } from 'svelte/store';

export interface Message {
	id: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp: Date;
	isStreaming?: boolean;
}

export interface Conversation {
	id: string;
	title: string;
	messages: Message[];
	createdAt: Date;
	updatedAt: Date;
	systemPrompt?: string;
}

export interface ChatState {
	conversations: Conversation[];
	activeConversationId: string | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: ChatState = {
	conversations: [],
	activeConversationId: null,
	isLoading: false,
	error: null
};

function createChatStore() {
	const { subscribe, set, update } = writable<ChatState>(initialState);

	return {
		subscribe,

		// Create new conversation
		createConversation: (systemPrompt?: string) => {
			const id = crypto.randomUUID();
			const now = new Date();

			update((state) => ({
				...state,
				conversations: [
					{
						id,
						title: 'Yeni Sohbet',
						messages: [],
						createdAt: now,
						updatedAt: now,
						systemPrompt
					},
					...state.conversations
				],
				activeConversationId: id
			}));

			return id;
		},

		// Set active conversation
		setActiveConversation: (id: string | null) => {
			update((state) => ({
				...state,
				activeConversationId: id
			}));
		},

		// Add message to active conversation
		addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => {
			const id = crypto.randomUUID();
			const timestamp = new Date();

			update((state) => {
				if (!state.activeConversationId) return state;

				return {
					...state,
					conversations: state.conversations.map((conv) =>
						conv.id === state.activeConversationId
							? {
									...conv,
									messages: [...conv.messages, { ...message, id, timestamp }],
									updatedAt: timestamp,
									// Update title from first user message
									title:
										conv.messages.length === 0 && message.role === 'user'
											? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
											: conv.title
								}
							: conv
					)
				};
			});

			return id;
		},

		// Update message content (for streaming)
		updateMessage: (messageId: string, content: string, isStreaming = true) => {
			update((state) => ({
				...state,
				conversations: state.conversations.map((conv) =>
					conv.id === state.activeConversationId
						? {
								...conv,
								messages: conv.messages.map((msg) =>
									msg.id === messageId ? { ...msg, content, isStreaming } : msg
								)
							}
						: conv
				)
			}));
		},

		// Complete streaming
		completeStreaming: (messageId: string) => {
			update((state) => ({
				...state,
				conversations: state.conversations.map((conv) =>
					conv.id === state.activeConversationId
						? {
								...conv,
								messages: conv.messages.map((msg) =>
									msg.id === messageId ? { ...msg, isStreaming: false } : msg
								)
							}
						: conv
				)
			}));
		},

		// Delete conversation
		deleteConversation: (id: string) => {
			update((state) => ({
				...state,
				conversations: state.conversations.filter((conv) => conv.id !== id),
				activeConversationId: state.activeConversationId === id ? null : state.activeConversationId
			}));
		},

		// Clear all conversations
		clearAllConversations: () => {
			update((state) => ({
				...state,
				conversations: [],
				activeConversationId: null
			}));
		},

		// Set loading state
		setLoading: (isLoading: boolean) => {
			update((state) => ({ ...state, isLoading }));
		},

		// Set error
		setError: (error: string | null) => {
			update((state) => ({ ...state, error }));
		},

		// Load from localStorage
		loadFromStorage: () => {
			if (typeof window === 'undefined') return;

			const stored = localStorage.getItem('bilge-conversations');
			if (stored) {
				try {
					const parsed = JSON.parse(stored);
					// Convert date strings back to Date objects
					const conversations = parsed.conversations.map((conv: Conversation) => ({
						...conv,
						createdAt: new Date(conv.createdAt),
						updatedAt: new Date(conv.updatedAt),
						messages: conv.messages.map((msg: Message) => ({
							...msg,
							timestamp: new Date(msg.timestamp)
						}))
					}));

					set({
						...initialState,
						conversations,
						activeConversationId: parsed.activeConversationId
					});
				} catch (e) {
					console.error('Failed to load conversations from storage:', e);
				}
			}
		},

		// Save to localStorage
		saveToStorage: () => {
			if (typeof window === 'undefined') return;

			const unsubscribe = subscribe((state) => {
				localStorage.setItem(
					'bilge-conversations',
					JSON.stringify({
						conversations: state.conversations,
						activeConversationId: state.activeConversationId
					})
				);
			});

			unsubscribe();
		}
	};
}

export const chatStore = createChatStore();

// Derived store for active conversation
export const activeConversation = derived(chatStore, ($chatStore) =>
	$chatStore.conversations.find((conv) => conv.id === $chatStore.activeConversationId)
);

// Derived store for conversation messages
export const activeMessages = derived(activeConversation, ($activeConversation) =>
	$activeConversation?.messages ?? []
);

// Auto-save to localStorage on changes
if (typeof window !== 'undefined') {
	chatStore.subscribe(() => {
		chatStore.saveToStorage();
	});
}
