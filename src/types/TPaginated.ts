import { Observable } from "rxjs";

export interface TPaginated<T1> {
	total: number;
	limit: number;
	skip: number;
	data: T1[];
}

export interface TPaginatedAddons<T1, T2 extends TPaginated<T1>> extends TPaginated<T1> {
	next?: () => Observable<T2 & TPaginatedAddons<T1, T2>>;
	back?: () => Observable<T2 & TPaginatedAddons<T1, T2>>;
}
