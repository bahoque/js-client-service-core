import { Observable } from "rxjs";
import { TPaginated } from "./TPaginated";
import { TParams } from "./TParams";

export interface TService<Model> {
	find(params?: TParams): Observable<TPaginated<Model>>;
	get(id: number, params?: TParams): Observable<Model>;
	create(data: Partial<Model>, params?: TParams): Observable<Model | Model[]>;
	update(id: number, data: Partial<Model>, params?: TParams): Observable<Model | Model[]>;
	patch(id: number, data: Partial<Model>, params?: TParams): Observable<Model | Model[]>;
	remove(id: number, params?: TParams): Observable<Model | Model[]>;
}
