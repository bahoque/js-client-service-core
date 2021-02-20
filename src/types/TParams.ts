import { TQuery } from "./TQuery";

export interface TPaginationOptions {
	default: number;
	max: number;
}

export interface TParams {
	query?: TQuery;
	paginate?: false | Pick<TPaginationOptions, "max">;
	headers?: { [key: string]: any };
	user?: { [key: string]: any };
}
