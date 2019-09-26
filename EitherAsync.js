(function () {
 
  const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

  const id = x => x;

  const EitherAsync = (actions, resolveMappings, rejectMappings) => ({

     map: (f) => EitherAsync(actions, compose(f, resolveMappings), rejectMappings),

     mapError: f => EitherAsync(actions, resolveMappings, compose(f, rejectMappings)),

     bimap: (f, g) => EitherAsync(actions, compose(f, resolveMappings), compose(g, rejectMappings)),

     ap: fv => EitherAsync((resolve, reject) => actions(f => fv.map(compose(f, resolveMappings)).cata({
        ok: resolve,
        error: reject
     }), reject), resolveMappings, rejectMappings),

     bind: f => EitherAsync((resolve, reject) => actions(x => f(resolveMappings(x)).cata({
        ok: resolve,
        error: reject
     }), reject), id, id),

     cata: alg => actions(compose(alg.ok, resolveMappings), compose(alg.error, rejectMappings)),

     toPromise: () => new Promise((resolve, reject) => actions(compose(resolve, resolveMappings), compose(reject, rejectMappings))),
     toEither: () => EitherAsync(actions, resolveMappings, rejectMappings),

  });

  Promise.prototype.toEither = function () {
     return EitherAsync((resolve, reject) => this.then(resolve).catch(reject), id, id);
  }

}())


module.exports = Promise
