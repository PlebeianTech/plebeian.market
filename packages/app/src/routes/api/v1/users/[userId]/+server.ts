import { error, json } from '@sveltejs/kit'
import { authorize } from '$lib/auth'
import { usersFilterSchema } from '$lib/schema'
import { deleteUser, getRichUsers, getUserById, updateUser, userExist } from '$lib/server/users.service'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params, request, url: { searchParams } }) => {
	const { userId } = params
	console.log(params, 'params', searchParams.has('exist'))
	try {
		await authorize(request, userId, 'GET')
		const [userRes] = await getRichUsers(usersFilterSchema.parse({ userId }))
		return json(userRes)
	} catch (e) {
		if (e.status === 401) {
			if (!searchParams.has('exist')) {
				const user = await getUserById(userId)
				const userUnAuthResponse = {
					id: user.id,
					created_at: user.createdAt.getTime() / 1000,
					name: user.name,
					displayName: user.displayName,
					about: user.about,
					image: user.image,
					banner: user.banner,
					nip05: user.nip05,
					lud06: user.lud06,
					lud16: user.lud16,
					zapService: user.zapService,
					website: user.website,
				}
				return json(userUnAuthResponse)
			} else {
				return json(await userExist(userId))
			}
		}
		throw e
	}
}

export const PUT: RequestHandler = async ({ params, request }) => {
	const { userId } = params

	try {
		await authorize(request, userId, 'PUT')
		const body = await request.json()
		return json(await updateUser(userId, body))
	} catch (e) {
		if (e.status) {
			return error(e.status, e.message)
		}
		return error(500, JSON.stringify(e))
	}
}

export const DELETE: RequestHandler = async ({ params, request }) => {
	const { userId } = params

	try {
		await authorize(request, userId, 'DELETE')
		return json(await deleteUser(userId))
	} catch (e) {
		if (e.status) {
			return error(e.status, e.message)
		}
		return error(500, JSON.stringify(e))
	}
}
