import { db, users, eq, type User } from '@plebeian/database'
import { error } from '@sveltejs/kit'
import { takeUniqueOrThrow } from '$lib/utils'


export const getAllUsers = (): User[] => {
	const usersResult = db.select().from(users).all()

	if (usersResult) {
		return usersResult
	}

	error(404, 'Not found')
}

export const getUserById = (id: string): User => {
	const user = db.select().from(users).where(eq(users.id, id)).all()
	const uniqueUser = takeUniqueOrThrow(user)

	if (uniqueUser) {
		return uniqueUser		
	}
	
	error(404, 'Not found')
}