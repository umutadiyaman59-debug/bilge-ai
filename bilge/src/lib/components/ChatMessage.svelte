<script lang="ts">
	import { parseMarkdown, formatTime, copyToClipboard } from '$lib/utils/markdown';
	import { settingsStore, t } from '$lib/stores/settings';
	import { uiStore } from '$lib/stores/ui';
	import type { Message } from '$lib/stores/chat';

	export let message: Message;

	let copied = false;

	$: isUser = message.role === 'user';
	$: language = $settingsStore.language;
	$: showTimestamps = $settingsStore.showTimestamps;
	$: parsedContent = isUser ? message.content : parseMarkdown(message.content);

	async function handleCopy() {
		const success = await copyToClipboard(message.content);
		if (success) {
			copied = true;
			uiStore.showToast(t('copied', language), 'success', 2000);
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}
</script>

<div class="message" class:message--user={isUser} class:message--assistant={!isUser}>
	<div class="message__avatar">
		{#if isUser}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
				<circle cx="12" cy="7" r="4" />
			</svg>
		{:else}
			<span class="message__avatar-logo">B</span>
		{/if}
	</div>

	<div class="message__content-wrapper">
		<div class="message__header">
			<span class="message__role">
				{isUser ? (language === 'tr' ? 'Siz' : 'You') : 'Bilge'}
			</span>
			{#if showTimestamps}
				<span class="message__time">{formatTime(message.timestamp)}</span>
			{/if}
		</div>

		<div class="message__content">
			{#if message.isStreaming}
				<div class="message__streaming">
					{@html parsedContent}
					<span class="message__cursor">▌</span>
				</div>
			{:else if isUser}
				<p>{message.content}</p>
			{:else}
				<div class="message__markdown">
					{@html parsedContent}
				</div>
			{/if}
		</div>

		{#if !isUser && !message.isStreaming}
			<div class="message__actions">
				<button
					class="message__action"
					on:click={handleCopy}
					title={t('copy', language)}
				>
					{#if copied}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="20 6 9 17 4 12" />
						</svg>
					{:else}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
							<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
						</svg>
					{/if}
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.message {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-6) var(--space-8);
		animation: slideUp 0.3s ease forwards;
		opacity: 0;
		animation-delay: 0.1s;
	}

	.message--user {
		background: var(--color-bg-secondary);
	}

	.message--assistant {
		background: var(--color-surface);
	}

	.message__avatar {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-lg);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
	}

	.message--user .message__avatar {
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
		color: white;
	}

	.message--assistant .message__avatar {
		background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
		color: var(--color-primary-dark);
	}

	.message__avatar svg {
		width: 18px;
		height: 18px;
	}

	.message__avatar-logo {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		font-weight: 700;
	}

	.message__content-wrapper {
		flex: 1;
		min-width: 0;
		max-width: var(--max-chat-width);
	}

	.message__header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-2);
	}

	.message__role {
		font-weight: 600;
		font-size: var(--text-sm);
		color: var(--color-text-primary);
	}

	.message__time {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.message__content {
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-text-primary);
	}

	.message__content p {
		margin: 0;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.message__streaming {
		display: inline;
	}

	.message__cursor {
		display: inline-block;
		color: var(--color-accent);
		animation: blink 0.8s infinite;
		margin-left: 2px;
	}

	.message__markdown {
		line-height: 1.7;
	}

	.message__markdown :global(p) {
		margin: 0 0 var(--space-4) 0;
		color: var(--color-text-primary);
	}

	.message__markdown :global(p:last-child) {
		margin-bottom: 0;
	}

	.message__markdown :global(h1),
	.message__markdown :global(h2),
	.message__markdown :global(h3),
	.message__markdown :global(h4) {
		margin: var(--space-6) 0 var(--space-3) 0;
		font-family: var(--font-display);
	}

	.message__markdown :global(h1:first-child),
	.message__markdown :global(h2:first-child),
	.message__markdown :global(h3:first-child) {
		margin-top: 0;
	}

	.message__markdown :global(ul),
	.message__markdown :global(ol) {
		margin: var(--space-4) 0;
		padding-left: var(--space-6);
	}

	.message__markdown :global(li) {
		margin-bottom: var(--space-2);
	}

	.message__markdown :global(code) {
		background: var(--color-bg-tertiary);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		font-size: 0.9em;
	}

	.message__markdown :global(pre) {
		background: var(--color-bg-tertiary);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		overflow-x: auto;
		margin: var(--space-4) 0;
		border: 1px solid var(--color-border);
	}

	.message__markdown :global(pre code) {
		background: none;
		padding: 0;
	}

	.message__markdown :global(blockquote) {
		border-left: 3px solid var(--color-accent);
		padding-left: var(--space-4);
		margin: var(--space-4) 0;
		color: var(--color-text-secondary);
		font-style: italic;
	}

	.message__markdown :global(a) {
		color: var(--color-primary);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.message__markdown :global(a:hover) {
		color: var(--color-accent);
	}

	.message__markdown :global(strong) {
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.message__markdown :global(em) {
		font-style: italic;
	}

	.message__markdown :global(hr) {
		border: none;
		border-top: 1px solid var(--color-border);
		margin: var(--space-6) 0;
	}

	.message__markdown :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: var(--space-4) 0;
	}

	.message__markdown :global(th),
	.message__markdown :global(td) {
		border: 1px solid var(--color-border);
		padding: var(--space-2) var(--space-3);
		text-align: left;
	}

	.message__markdown :global(th) {
		background: var(--color-bg-secondary);
		font-weight: 600;
	}

	.message__actions {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-3);
		opacity: 0;
		transition: opacity var(--transition-fast);
	}

	.message:hover .message__actions {
		opacity: 1;
	}

	.message__action {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: none;
		background: var(--color-bg-secondary);
		border-radius: var(--radius-md);
		color: var(--color-text-tertiary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.message__action:hover {
		background: var(--color-bg-tertiary);
		color: var(--color-text-primary);
	}

	.message__action svg {
		width: 14px;
		height: 14px;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0; }
	}
</style>
