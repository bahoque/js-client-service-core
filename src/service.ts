import * as lodash from "lodash";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TPaginated, TPaginatedAddons, TParams, TService } from "./types";

export class Service<T1> implements TService<T1> {
	protected makeFind(params: TParams, skip: number, limit: number) {
		return () => this.find(lodash.merge(params, { query: { $limit: limit, $skip: skip } }));
	}

	raw<T>(method: keyof TService<T>, ...rest: any): Observable<T> {
		throw "Raw method not implemented";
	}

	find(params?: TParams): Observable<TPaginatedAddons<T1, TPaginated<T1>>> {
		const hooks = (data: TPaginated<T1>): Partial<TPaginatedAddons<T1, TPaginated<T1>>> => {
			let added: Partial<TPaginatedAddons<T1, TPaginated<T1>>> = {};

			if (data.skip >= data.limit) added.back = this.makeFind(params, data.limit, data.skip - data.limit);
			if (data.skip + data.limit < data.total) added.next = this.makeFind(params, data.limit, data.skip + data.limit);
			return added;
		};

		return this.raw<TPaginated<T1>>("find", params).pipe(map((it) => ({ ...it, ...hooks(it) })));
	}

	findAll(params: TParams = {}): Observable<T1[]> {
		delete params.paginate;

		return new Observable<T1[]>((subscriber) => {
			let loopRecursive = (find: Observable<TPaginatedAddons<T1, TPaginated<T1>>>) =>
				find.subscribe(({ data, next }: TPaginatedAddons<T1, TPaginated<T1>>) => {
					subscriber.next(data);
					if (next) loopRecursive(next());
					else subscriber.complete();
				});

			loopRecursive(this.find(params));
		});
	}

	get(id: number, params?: TParams): Observable<T1> {
		return this.raw<T1>("get", id, params);
	}

	create(data: Partial<T1>, params?: TParams): Observable<T1[] | T1> {
		return this.raw<T1>("create", data, params);
	}

	update(id: number, data: Partial<T1>, params?: TParams): Observable<T1[] | T1> {
		return this.raw<T1>("update", id, data, params);
	}

	patch(id: number, data: Partial<T1>, params?: TParams): Observable<T1[] | T1> {
		return this.raw<T1>("patch", id, data, params);
	}

	remove(id: number, params?: TParams): Observable<T1[] | T1> {
		return this.raw<T1>("remove", id, params);
	}
}
