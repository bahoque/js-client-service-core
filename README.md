# client-service-core

Base para cliente API micro-servicios

---

### ¿Como usar?

service.ts
```typescript
import { Service, TService } from "@bahoque/client-service-core";

export class MyService<T1 = any> extends Service<T1> {
	/* El método raw se encarga de lanzar la petición
	 * recibiendo como primer parámetro el método 
	 * get, find, create, update, patch o remove
	 * seguido de los parámetros pasados a dicho método
	 * 
	 * En caso de get rest será: [id: number]
	 * En caso de find rest será: [params: TParams]
	 * En caso de create rest será: [data: T1, param: TParams]
	 * En caso de update o path rest será: [id: number, data: T1, param: TParams]
	 * En caso de remove rest será: [id: number, param: TParams]
	 */
	raw<T>(method: keyof TService<T>, ...rest: any[]): Observable<T> {
		// Tu código...
	}
}
```

index.ts
```typescript
import {MyService} from "./service";

interface user {
	name: string;
	email: string;
}

const userService = new MyService<user>();

userService.get(1).subscribe(res => {
	// Tu código
});

userService.find({ /* query */ }).subscribe(res => {
	// Tu código
});

userService.create({name: 'test', email: 'test@test.com'}).subscribe(res => {
	// Tu código
});

userService.patch(1, {name: 'test', email: 'test@test.com'}, { /* query */ }).subscribe(res => {
	// Tu código
});

userService.remove(1, { /* query */ }).subscribe(res => {
	// Tu código
});
```
