export class ShippingMethod {
	constructor(
		public id: string,
		public name: string,
		public cost: string,
		public regions: string[] = [],
		public countries: string[] = [],
	) {}

	addRegion(region: string) {
		this.regions.push(region)
	}

	removeRegion(region: string) {
		this.regions = this.regions.filter((z) => z !== region)
	}

	addCountry(country: string) {
		this.countries.push(country)
	}

	removeCountry(country: string) {
		this.countries = this.countries.filter((z) => z !== country)
	}

	get json() {
		return { id: this.id, name: this.name, cost: this.cost, regions: this.regions, countries: this.countries }
	}
}