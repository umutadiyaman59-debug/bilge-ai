<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { settingsStore, t } from '$lib/stores/settings';
	import { chatStore } from '$lib/stores/chat';

	const dispatch = createEventDispatcher<{ send: string }>();

	let message = '';
	let textareaElement: HTMLTextAreaElement;

	$: language = $settingsStore.language;
	$: sendOnEnter = $settingsStore.sendOnEnter;
	$: isLoading = $chatStore.isLoading;
	$: canSend = message.trim().length > 0 && !isLoading;

	function handleSend() {
		if (!canSend) return;

		dispatch('send', message.trim());
		message = '';

		// Reset textarea height
		if (textareaElement) {
			textareaElement.style.height = 'auto';
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey && sendOnEnter) {
			event.preventDefault();
			handleSend();
		}
	}

	function handleInput() {
		// Auto-resize textarea
		if (textareaElement) {
			textareaElement.style.height = 'auto';
			textareaElement.style.height = Math.min(textareaElement.scrollHeight, 200) + 'px';
		}
	}
</script>

<div class="chat-input">
	<div class="chat-input__container">
		<div class="chat-input__wrapper">
			<textarea
				bind:this={textareaElement}
				bind:value={message}
				on:keydown={handleKeydown}
				on:input={handleInput}
				placeholder={t('typeMessage', language)}
				rows="1"
				disabled={isLoading}
				class="chat-input__textarea"
			/>

			<div class="chat-input__actions">
				<!-- Emoji button -->
				<button
					type="button"
					class="chat-input__btn chat-input__btn--icon"
					title="Emoji"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10" />
						<path d="M8 14s1.5 2 4 2 4-2 4-2" />
						<line x1="9" y1="9" x2="9.01" y2="9" />
						<line x1="15" y1="9" x2="15.01" y2="9" />
					</svg>
				</button>

				<!-- Send button -->
				<button
					type="button"
					class="chat-input__btn chat-input__btn--send"
					class:chat-input__btn--disabled={!canSend}
					on:click={handleSend}
					disabled={!canSend}
					title={t('send', language)}
				>
					{#if isLoading}
						<div class="chat-input__spinner"></div>
					{:else}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="22" y1="2" x2="11" y2="13" />
							<polygon points="22 2 15 22 11 13 2 9 22 2" />
						</svg>
					{/if}
				</button>
			</div>
		</div>

		<p class="chat-input__hint">
			{#if sendOnEnter}
				<kbd>Enter</kbd> {language === 'tr' ? 'gönder' : 'to send'}, <kbd>Shift+Enter</kbd> {language === 'tr' ? 'yeni satır' : 'for new line'}
			{:else}
				<kbd>Shift+Enter</kbd> {language === 'tr' ? 'yeni satır' : 'for new line'}
			{/if}
		</p>
	</div>
</div>

<style>
	.chat-input {
		padding: var(--space-4) var(--space-6);
		background: linear-gradient(to top, var(--color-bg-primary) 80%, transparent);
		position: sticky;
		bottom: 0;
	}

	.chat-input__container {
		max-width: var(--max-chat-width);
		margin: 0 auto;
	}

	.chat-input__wrapper {
		display: flex;
		align-items: flex-end;
		gap: var(--space-3);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-2xl);
		padding: var(--space-3) var(--space-4);
		transition: all var(--transition-fast);
		box-shadow: var(--shadow-lg);
	}

	.chat-input__wrapper:focus-within {
		border-color: var(--color-accent);
		box-shadow: var(--shadow-lg), 0 0 0 3px rgba(212, 168, 83, 0.1);
	}

	.chat-input__textarea {
		flex: 1;
		border: none;
		background: transparent;
		font-family: var(--font-body);
		font-size: var(--text-base);
		color: var(--color-text-primary);
		resize: none;
		outline: none;
		line-height: 1.5;
		max-height: 200px;
		padding: var(--space-1) 0;
	}

	.chat-input__textarea::placeholder {
		color: var(--color-text-tertiary);
	}

	.chat-input__textarea:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.chat-input__actions {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-shrink: 0;
	}

	.chat-input__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: none;
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.chat-input__btn svg {
		width: 18px;
		height: 18px;
	}

	.chat-input__btn--icon {
		background: transparent;
		color: var(--color-text-tertiary);
	}

	.chat-input__btn--icon:hover {
		background: var(--color-bg-secondary);
		color: var(--color-text-primary);
	}

	.chat-input__btn--send {
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
		color: white;
		box-shadow: var(--shadow-md);
	}

	.chat-input__btn--send:hover:not(:disabled) {
		transform: scale(1.05);
		box-shadow: var(--shadow-lg);
	}

	.chat-input__btn--send:active:not(:disabled) {
		transform: scale(0.95);
	}

	.chat-input__btn--disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none !important;
	}

	.chat-input__spinner {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.chat-input__hint {
		text-align: center;
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		margin-top: var(--space-3);
	}

	.chat-input__hint kbd {
		display: inline-block;
		padding: 2px 6px;
		font-family: var(--font-body);
		font-size: 0.75rem;
		background: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		box-shadow: 0 1px 0 var(--color-border);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		.chat-input {
			padding: var(--space-3) var(--space-4);
		}

		.chat-input__hint {
			display: none;
		}
	}
</style>
