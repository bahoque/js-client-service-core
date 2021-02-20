"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const rxjs_1 = require("rxjs");
const lodash = require("lodash");
const operators_1 = require("rxjs/operators");
class Service {
    makeFind(params, skip, limit) {
        return () => this.find(lodash.merge(params, { query: { $limit: limit, $skip: skip } }));
    }
    raw(method, ...rest) {
        throw "Raw method not implemented";
    }
    find(params) {
        const hooks = (data) => {
            let added = {};
            if (data.skip >= data.limit)
                added.back = this.makeFind(params, data.limit, data.skip - data.limit);
            if (data.skip + data.limit < data.total)
                added.next = this.makeFind(params, data.limit, data.skip + data.limit);
            return added;
        };
        return this.raw("find", params).pipe(operators_1.map((it) => ({ ...it, ...hooks(it) })));
    }
    findAll(params = {}) {
        delete params.paginate;
        return new rxjs_1.Observable((subscriber) => {
            let loopRecursive = (find) => find.subscribe(({ data, next }) => {
                subscriber.next(data);
                if (next)
                    loopRecursive(next());
                else
                    subscriber.complete();
            });
            loopRecursive(this.find(params));
        });
    }
    get(id, params) {
        return this.raw("get", id, params);
    }
    create(data, params) {
        return this.raw("create", data, params);
    }
    update(id, data, params) {
        return this.raw("update", id, data, params);
    }
    patch(id, data, params) {
        return this.raw("patch", id, data, params);
    }
    remove(id, params) {
        return this.raw("remove", id, params);
    }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map