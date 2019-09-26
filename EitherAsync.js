(function () {

  Promise.prototype.map = function (f) {
    return (self => new Promise(function (resolve) {
      self.then(result => resolve(f(result)))
    }))(this);
  }

  const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

  var id = x => x;

  var EitherAsync = (actions, fOk, fError) => ({
    map: f => EitherAsync(actions, compose(f, fOk), fError),
    mapError: f => EitherAsync(actions, fOk, compose(f, fError)),
    bimap: (f, g) => EitherAsync(actions, compose(f, fOk), compose(g, fError)),
    ap: fv => EitherAsync((resolve, reject) => actions(f => fv.map(compose(f, fOk)).cata({
      ok: resolve,
      error: reject
    }), reject), fOk, fError),

    bind: f => EitherAsync((resolve, reject) => actions(x => f(fOk(x)).cata({
      ok: resolve,
      error: reject
    }), reject), id, id),
    cata: alg => actions(compose(alg.ok, fOk), compose(alg.error, fError)),
  });

  Promise.prototype.toEither = function () {
    return EitherAsync((resolve, reject) => this.then(resolve).catch(reject), id, id);
  }

}())