import type { RichPaymentDetail } from '$lib/server/paymentDetails.service'
import { createMutation } from '@tanstack/svelte-query'
import ndkStore from '$lib/stores/ndk'
import { toast } from 'svelte-sonner'
import { get } from 'svelte/store'

import { createRequest, queryClient } from './client'

export type PostStall = {
	paymentDetails: string
	paymentMethod: string
	stallId: string | null
	isDefault: boolean
}

declare module './client' {
	interface Endpoints {
		[k: `POST /api/v1/wallets/?userId=${string}`]: Operation<string, 'POST', never, object, object, never>
		[k: `PUT /api/v1/wallets/?userId=${string}&walletId=${string}`]: Operation<string, 'PUT', never, object, object, never>
		[k: `DELETE /api/v1/wallets/?walletId=${string}`]: Operation<string, 'DELETE', never, never, boolean, never>
	}
}
export const persistWalletMutation = createMutation(
	{
		mutationKey: [],
		mutationFn: async (walletDetails: object) => {
			const $ndkStore = get(ndkStore)
			if ($ndkStore.activeUser?.pubkey) {
				const pd = await createRequest(`POST /api/v1/wallets/?userId=${$ndkStore.activeUser.pubkey}`, {
					auth: true,
					body: {
						walletDetails,
					},
				})
				return pd
			}
			return null
		},
		onSuccess: () => {
			// const $ndkStore = get(ndkStore)
			// queryClient.invalidateQueries({ queryKey: ['paymentDetails', $ndkStore.activeUser?.pubkey] })
		},
	},
	queryClient,
)

// export const updatePaymentMethodMutation = createMutation(
// 	{
// 		mutationKey: [],
// 		mutationFn: async ({ paymentDetails, paymentMethod, stallId, paymentDetailId, isDefault }: PostStall & { paymentDetailId: string }) => {
// 			const $ndkStore = get(ndkStore)
// 			if ($ndkStore.activeUser?.pubkey) {
// 				const pd = await createRequest(`PUT /api/v1/payments/?userId=${$ndkStore.activeUser.pubkey}&paymentDetailId=${paymentDetailId}`, {
// 					auth: true,
// 					body: {
// 						paymentDetails,
// 						paymentMethod,
// 						stallId,
// 						isDefault,
// 					},
// 				})
// 				toast.success('Payment updated')
// 				return pd
// 			}
// 			toast.error(`Payment not updated`)
// 			return null
// 		},
// 		onSuccess: () => {
// 			const $ndkStore = get(ndkStore)
// 			queryClient.invalidateQueries({ queryKey: ['paymentDetails', $ndkStore.activeUser?.pubkey] })
// 		},
// 	},
// 	queryClient,
// )

// export const deletePaymentMethodMutation = createMutation(
// 	{
// 		mutationKey: [],
// 		mutationFn: async ({ paymentDetailId, userId }: { paymentDetailId: string; userId: string }) => {
// 			const $ndkStore = get(ndkStore)
// 			if ($ndkStore.activeUser?.pubkey) {
// 				const pd = await createRequest(`DELETE /api/v1/payments/?paymentDetailId=${paymentDetailId}&userId=${userId}`, {
// 					auth: true,
// 				})
// 				return pd
// 			}
// 			return null
// 		},
// 		onSuccess: () => {
// 			const $ndkStore = get(ndkStore)
// 			queryClient.invalidateQueries({ queryKey: ['paymentDetails', $ndkStore.activeUser?.pubkey] })
// 		},
// 	},
// 	queryClient,
// )

// export const setDefaultPaymentMethodForStallMutation = createMutation(
// 	{
// 		mutationKey: [],
// 		mutationFn: async ({ stallId, paymentDetailId }: { stallId: string; paymentDetailId: string }) => {
// 			const $ndkStore = get(ndkStore)
// 			if ($ndkStore.activeUser?.pubkey) {
// 				const pd = await createRequest(`POST /api/v1/payments/${stallId}/?paymentDetailId=${paymentDetailId}`, {
// 					auth: true,
// 				})
// 				return pd
// 			}
// 			return null
// 		},
// 		onSuccess: (data) => {
// 			queryClient.invalidateQueries({ queryKey: ['paymentDetails', data?.stallId] })
// 		},
// 	},
// 	queryClient,
// )
