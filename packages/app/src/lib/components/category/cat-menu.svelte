<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination'
	import { createCategoriesByFilterQuery } from '$lib/fetch/category.queries'
	import { reactiveDebounce } from '$lib/utils'
	import { writable } from 'svelte/store'

	import Input from '../ui/input/input.svelte'
	import Skeleton from '../ui/skeleton/skeleton.svelte'
	import CatCompactItem from './cat-compact-item.svelte'

	let search = writable('')

	$: debouncedSearch = reactiveDebounce(search, 600)
	$: $search, (page = 1)
	const pageSize = 10
	let page = 1

	$: categoriesQuery = createCategoriesByFilterQuery({ pageSize, page, search: $debouncedSearch })
</script>

<div class="flex flex-col gap-6">
	<h2>Categories</h2>
	<Input class="" type="search" placeholder="Search..." bind:value={$search} />
	{#if $categoriesQuery.isLoading}
		<Skeleton class=" h-96 w-full" />
	{:else if $categoriesQuery.data?.categories.length}
		<div class="flex flex-col gap-6">
			<div class="flex flex-col">
				<main class="text-black">
					<div class="lg:px-12">
						<div class="container">
							<div class="grid auto-cols-max grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
								{#each $categoriesQuery.data?.categories as cat (cat.name)}
									<CatCompactItem {cat} />
								{/each}
							</div>
						</div>
					</div>
				</main>
			</div>
			<Pagination.Root bind:page count={$categoriesQuery.data?.total} perPage={pageSize} let:pages let:currentPage>
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton />
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage == page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.NextButton />
					</Pagination.Item>
				</Pagination.Content>
			</Pagination.Root>
		</div>
	{/if}
</div>
