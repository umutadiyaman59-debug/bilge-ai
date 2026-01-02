import { marked } from 'marked';

// Configure marked for safe rendering
marked.setOptions({
	gfm: true,
	breaks: true
});

/**
 * Parse markdown content to HTML
 */
export function parseMarkdown(content: string): string {
	return marked.parse(content) as string;
}

/**
 * Format timestamp for display
 */
export function formatTime(date: Date, locale: string = 'tr-TR'): string {
	return new Intl.DateTimeFormat(locale, {
		hour: '2-digit',
		minute: '2-digit'
	}).format(date);
}

/**
 * Format date for conversation grouping
 */
export function formatDate(date: Date, locale: string = 'tr-TR'): string {
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (days === 0) {
		return locale === 'tr-TR' ? 'Bugün' : 'Today';
	} else if (days === 1) {
		return locale === 'tr-TR' ? 'Dün' : 'Yesterday';
	} else if (days < 7) {
		return locale === 'tr-TR' ? 'Bu Hafta' : 'This Week';
	} else {
		return new Intl.DateTimeFormat(locale, {
			day: 'numeric',
			month: 'short'
		}).format(date);
	}
}

/**
 * Group conversations by date
 */
export function groupConversationsByDate<T extends { updatedAt: Date }>(
	conversations: T[],
	locale: string = 'tr-TR'
): Map<string, T[]> {
	const groups = new Map<string, T[]>();

	conversations.forEach((conv) => {
		const key = formatDate(conv.updatedAt, locale);
		const existing = groups.get(key) || [];
		groups.set(key, [...existing, conv]);
	});

	return groups;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		// Fallback for older browsers
		const textArea = document.createElement('textarea');
		textArea.value = text;
		textArea.style.position = 'fixed';
		textArea.style.left = '-999999px';
		document.body.appendChild(textArea);
		textArea.select();

		try {
			document.execCommand('copy');
			return true;
		} catch {
			return false;
		} finally {
			document.body.removeChild(textArea);
		}
	}
}

/**
 * Generate unique ID
 */
export function generateId(): string {
	return crypto.randomUUID();
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => void>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;

	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength).trim() + '...';
}
