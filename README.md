 
# Async-Either
https://medium.com/@dimpapadim3/async-functional-error-handling-9332dfe9f78c
 
####Javascript　

```javascript

require("either-async")

Promise.resolve(5)
    .toEither()
    .map (x => x^2) 
    .cata({
        ok: console.log,
        error: e => console.log(`error: ${e}`)
    });

Promise.reject("invalid name")
    .toEither()
    .map (x => x^2) 
    .mapError(x => x.toUpperCase())
    .cata({
        ok: console.log,
        error: e => console.log(`error: ${e}`)
    });

    Promise.reject("invalid name")
    .toEither()
    .bimap (x => x^2, x => x.toUpperCase())  
    .cata({
        ok: console.log,
        error: e => console.log(`error: ${e}`)
    });

 Promise.resolve(5)
    .toEither()
    .map (x => x^2) 
    .mapError(x => x.toUpperCase())
    .bind(x=> Promise.resolve(x+5).toEither())
    .cata({
        ok: console.log,
        error: e => console.log(`error: ${e}`)
    });

const delayed = Promise.resolve(5)
    .toEither()
    .map(x => x * x)
    .bind(x => Promise.reject(x + 5).toEither());

setTimeout(function () {
    delayed.cata({
        ok: console.log,
        error: e => console.log(`error: ${e}`)
    });
}, 2000)


Promise.resolve(x => y => x + y)
    .toEither()
    .ap(Promise.reject(5).toEither())
    .ap(Promise.resolve(5).toEither())
    .cata({
        ok: console.log,
        error: e => console.log(`error: ${e}`)
    });
```
 
