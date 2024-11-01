<script lang="ts">
	import type { CheckoutFormData } from '$lib/schema'
	import type { ValidationErrors } from '$lib/utils/zod.utils'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import Textarea from '$lib/components/ui/textarea/textarea.svelte'
	import { checkoutFormSchema } from '$lib/schema'
	import { checkoutFormStore } from '$lib/stores/checkout'
	import { validateForm } from '$lib/utils/zod.utils'
	import { createEventDispatcher, onMount } from 'svelte'

	import { FormLabels } from './types'

	const dispatch = createEventDispatcher<{
		validate: { valid: boolean }
	}>()

	let formData: CheckoutFormData = {
		contactName: '',
		contactPhone: '',
		contactEmail: '',
		address: '',
		zip: '',
		city: '',
		country: '',
		region: '',
		observations: '',
	}

	let validationErrors: ValidationErrors = {}

	function handleSubmit() {
		validationErrors = validateForm(formData, checkoutFormSchema)
		if (Object.keys(validationErrors).length === 0) {
			checkoutFormStore.set(formData)
			dispatch('validate', { valid: true })
		}
	}

	onMount(() => {
		if ($checkoutFormStore) {
			formData = $checkoutFormStore
		}
	})
</script>

<form on:submit|preventDefault={handleSubmit}>
	<Label>
		<span class="required-mark">{FormLabels.contactName}</span>
		{#if validationErrors.contactName}<span class="text-red-500">{validationErrors.contactName}</span>{/if}
		<Input type="text" bind:value={formData.contactName} required />
	</Label>
	<Label>
		{FormLabels.contactPhone}
		{#if validationErrors.contactPhone}<span class="text-red-500">{validationErrors.contactPhone}</span>{/if}
		<Input type="tel" bind:value={formData.contactPhone} />
	</Label>
	<Label>
		<span class="required-mark">{FormLabels.contactEmail}</span>
		{#if validationErrors.contactEmail}<span class="text-red-500">{validationErrors.contactEmail}</span>{/if}
		<Input type="email" bind:value={formData.contactEmail} required />
	</Label>
	<Label>
		<span class="required-mark">{FormLabels.address}</span>
		{#if validationErrors.address}<span class="text-red-500">{validationErrors.address}</span>{/if}
		<Input type="text" bind:value={formData.address} required />
	</Label>
	<Label>
		<span class="required-mark">{FormLabels.zip}</span>
		{#if validationErrors.zip}<span class="text-red-500">{validationErrors.zip}</span>{/if}
		<Input type="text" bind:value={formData.zip} required />
	</Label>
	<Label>
		<span class="required-mark">{FormLabels.city}</span>
		{#if validationErrors.city}<span class="text-red-500">{validationErrors.city}</span>{/if}
		<Input type="text" bind:value={formData.city} required />
	</Label>
	<Label>
		<span class="required-mark">{FormLabels.country}</span>
		{#if validationErrors.country}<span class="text-red-500">{validationErrors.country}</span>{/if}
		<Input type="text" bind:value={formData.country} required />
	</Label>
	<Label>
		{FormLabels.region}
		{#if validationErrors.region}<span class="text-red-500">{validationErrors.region}</span>{/if}
		<Input type="text" bind:value={formData.region} />
	</Label>
	<Label>
		{FormLabels.observations}
		{#if validationErrors.observations}<span class="text-red-500">{validationErrors.observations}</span>{/if}
		<Textarea bind:value={formData.observations}></Textarea>
	</Label>
	<Button type="submit" class="w-full mt-6">Finish Review</Button>
</form>
