// Random Selection Support.
function randomBetween(m, n) {
  return Math.floor((Math.random() * n) + m);
}

function pick(n, xs) {
  let m = xs.length - 1;

  let ns = _.range(n);

  return _.map(ns, function () {
    return xs[randomBetween(0, m)];
  });
}
