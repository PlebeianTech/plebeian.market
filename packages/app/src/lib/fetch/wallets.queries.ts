import { createQuery } from '@tanstack/svelte-query'
import ndkStore from '$lib/stores/ndk'
import { derived } from 'svelte/store'

import { createRequest, queryClient } from './client'

declare module './client' {
	interface Endpoints {
		[k: `GET /api/v1/wallets/?userId=${string}`]: Operation<string, 'GET', never, never, object[], never>
	}
}

export const userWalletQuery = createQuery(
	derived(ndkStore, ($ndkStore) => ({
		queryKey: ['walletDetails', $ndkStore.activeUser?.pubkey],
		queryFn: async () => {
			if ($ndkStore.activeUser?.pubkey) {
				const wallet = await createRequest(`GET /api/v1/wallets/?userId=${$ndkStore.activeUser.pubkey}`, {
					auth: true,
				})

				return wallet
			}
			return null
		},
		enabled: !!$ndkStore.activeUser?.pubkey,
	})),
	queryClient,
)

// export const paymentsForStallQuery = (stallId: string) =>
// 	createQuery<RichPaymentDetail[]>(
// 		{
// 			queryKey: ['paymentDetails', stallId],
// 			queryFn: async () => {
// 				const paymentDetails = await createRequest(`GET /api/v1/payments/${stallId}`, {
// 					auth: true,
// 				})
// 				return paymentDetails
// 			},
// 		},
// 		queryClient,
// 	)
