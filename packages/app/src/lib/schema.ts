import { z } from 'zod'

export const generalFilterSchema = z.object({
	pageSize: z.coerce.number().min(1).default(10),
	page: z.coerce.number().min(1).default(1),
	order: z.enum(['asc', 'desc']).default('asc'),
})

export const auctionsFilterSchema = generalFilterSchema.extend({
	orderBy: z.enum(['createdAt', 'startDate', 'endDate']).default('createdAt'),
})

export type AuctionsFilter = z.infer<typeof auctionsFilterSchema>

export const usersFilterSchema = generalFilterSchema.extend({
	orderBy: z.enum(['createdAt']).default('createdAt'),
})

export type UsersFilter = z.infer<typeof usersFilterSchema>

export const productsFilterSchema = generalFilterSchema.extend({
	orderBy: z.enum(['createdAt', 'price']).default('createdAt'),
})

export type ProductsFilter = z.infer<typeof productsFilterSchema>

export const stallsFilterSchema = generalFilterSchema.extend({
	orderBy: z.enum(['createdAt']).default('createdAt'),
})

export type StallsFilter = z.infer<typeof stallsFilterSchema>

export const initialSetupDataSchema = z.object({
	instancePk: z.string().startsWith('npub'),
	ownerPk: z.string().startsWith('npub'),
	instanceName: z.string(),
	logoUrl: z.string().url(),
	contactEmail: z.string().email(),
	defaultCurrency: z.string(),
	allowRegister: z.coerce.boolean(),
	derp: z.string().optional(),
})
