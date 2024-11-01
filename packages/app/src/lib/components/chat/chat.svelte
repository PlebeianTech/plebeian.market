<script lang="ts">
	import { createUserByIdQuery, createUserRelaysByIdQuery } from '$lib/fetch/users.queries'
	import { createDMSubscriptionManager, dmKind04Sub, groupedDMs } from '$lib/nostrSubs/subs'
	import { manageUserRelays } from '$lib/nostrSubs/userRelayManager'
	import { chatNotifications } from '$lib/stores/chat-notifications'
	import { truncateString } from '$lib/utils'
	import { sendDM } from '$lib/utils/dm.utils'
	import { SendHorizontal } from 'lucide-svelte'
	import { onDestroy, onMount } from 'svelte'

	import CAvatar from '../ui/custom-components/c-avatar.svelte'
	import Textarea from '../ui/textarea/textarea.svelte'
	import ChatBubble from './chat-bubble.svelte'

	export let selectedPubkey: string
	$: messages = $groupedDMs[selectedPubkey] || []

	$: {
		messages.sort((a, b) => (a.created_at ?? 0) - (b.created_at ?? 0))
		scrollToBottom()
		if (messages.length > 0) {
			chatNotifications.markAllRead(selectedPubkey)
		}
	}
	let messagesContainerRef: HTMLDivElement
	let message = ''

	const userProfileQuery = createUserByIdQuery(selectedPubkey)
	const userRelays = createUserRelaysByIdQuery(selectedPubkey)
	const handleSend = async () => {
		if (message.trim()) {
			await sendDM(message, selectedPubkey)
			message = ''
			document.querySelector<HTMLTextAreaElement>('textarea[name="message"]')?.focus()
		}
	}

	function scrollToBottom() {
		if (messagesContainerRef) {
			messagesContainerRef.scrollTop = messagesContainerRef.scrollHeight
		}
	}

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			handleSend()
		}
	}

	$: if ($userRelays.data) {
		manageUserRelays($userRelays.data, 'add')
	}

	const dmManager = createDMSubscriptionManager(dmKind04Sub)

	onMount(async () => {
		dmManager.loadConversationHistory(selectedPubkey)
		scrollToBottom()
	})

	onDestroy(() => {
		if ($userRelays.data) {
			manageUserRelays($userRelays.data, 'remove')
		}
	})
</script>

<div class="flex flex-col h-full max-w-4xl mx-auto">
	<div class="p-4 border-b flex items-center gap-2">
		<CAvatar pubkey={selectedPubkey} profile={$userProfileQuery?.data} />
		<div class="overflow-hidden flex-1">
			<h3 class="text-xl font-semibold truncate">
				{$userProfileQuery?.data?.name || $userProfileQuery?.data?.displayName || truncateString(selectedPubkey)}
			</h3>
		</div>
	</div>

	<div bind:this={messagesContainerRef} class="flex-grow overflow-y-auto p-4 space-y-4">
		{#each messages as message (message.id)}
			<ChatBubble {message} {selectedPubkey} isCurrentUser={message.pubkey !== selectedPubkey} />
		{/each}
	</div>

	<div class="p-4 border-t shrink-0">
		<div class="flex items-center gap-2">
			<Textarea
				bind:value={message}
				on:keydown={handleKeyPress}
				name="message"
				placeholder="Type a message..."
				class="flex-grow resize-none"
				rows={1}
			/>
			{#if message.trim()}
				<button class="p-2 bg-primary text-primary-foreground rounded-full flex-shrink-0" on:click={handleSend}>
					<SendHorizontal size={20} />
				</button>
			{/if}
		</div>
	</div>
</div>
