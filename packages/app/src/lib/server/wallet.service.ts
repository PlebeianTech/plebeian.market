import { error } from '@sveltejs/kit'

import type { PaymentDetail, WalletType } from '@plebeian/database'
import { and, db, eq, paymentDetails, USER_META, userMeta } from '@plebeian/database'

export type RichPaymentDetail = PaymentDetail & {
	stallName: string
}

export const getWalletsByUserId = async (userId: string) => {
	const userWallets = await db
		.select()
		.from(userMeta)
		.where(and(eq(userMeta.metaName, USER_META.WALLET.value), eq(userMeta.userId, userId)))
		.execute()

	if (!userWallets.length) {
		throw error(404, `Platform share not found for user ${userId}`)
	}

	return userWallets
}

export const postWalletForUser = async (walletType: WalletType, userId: string, walletDetails: string) => {
	try {
		const [result] = await db
			.insert(userMeta)
			.values({
				userId: userId,
				metaName: USER_META.WALLET.value,
				key: walletType,
				valueText: walletDetails,
			})
			.returning()

		if (!result) {
			throw new Error('Failed to insert wallet')
		}

		return result
	} catch (e) {
		console.error(e)
		throw error(500, `Failed to create wallet for user ${userId}. Reason: ${e}`)
	}
}

export const updateWalletForUser = async (walletId: string, userId: string, walletDetails: string) => {
	try {
		const [result] = await db
			.update(userMeta)
			.set({
				valueText: walletDetails,
			})
			.where(and(eq(userMeta.metaName, USER_META.WALLET.value), eq(userMeta.userId, userId), eq(userMeta.id, walletId)))
			.returning()

		if (!result) {
			throw new Error('Failed to update wallet')
		}

		return result
	} catch (e) {
		console.error(e)
		throw error(500, `Failed to create wallet for user ${userId}. Reason: ${e}`)
	}
}

export const deleteWalletForUser = async (walletId: string, userId: string) => {
	try {
		const [result] = await db
			.delete(userMeta)
			.where(and(eq(userMeta.metaName, USER_META.WALLET.value), eq(userMeta.userId, userId), eq(userMeta.id, walletId)))
			.returning()

		if (!result) {
			throw new Error('Failed to delete wallet')
		}

		return result
	} catch (e) {
		console.error(e)
		throw error(500, `Failed to delete wallet for user ${userId}. Reason: ${e}`)
	}
}
