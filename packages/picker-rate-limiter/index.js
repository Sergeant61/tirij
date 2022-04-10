export const name = 'picker-rate-limiter';

PickerRateLimiter = function (options = {}) {
  let stores = [];
  const originalUrl = options.originalUrl || '/api/methods/';
  const max = options.max || 15;
  const windowMs = options.windowMs || 1 * 60 * 1000 // 1 minute
  const storeRestMs = options.storeRestMs || 24 * 60 * 60 * 1000 // 1 day

  Meteor.setInterval(function () {
    stores = [];
  }, storeRestMs);

  function done(res, code = (options.errorCode || 429), message = (options.errorMessage || 'Too many requests, please try again later.')) {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error: message }));
    res.end();
  }

  function setRateLimitHeader(res, data) {
    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', max - data.count);
    res.setHeader('RateLimit-Reset', data.lastReqAt.getTime() + windowMs);
  }

  return function (req, res, next) {
    if (req.originalUrl.startsWith(originalUrl)) {
      const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
      let storeIndex = stores.findIndex(store => store.ip == ip);

      if (storeIndex === -1) {
        stores.push({
          ip: ip,
          count: 1,
          lastReqAt: new Date()
        });
        storeIndex = stores.length - 1;
      } else {
        const newReqAt = new Date();
        const diff = newReqAt - stores[storeIndex].lastReqAt;

        if (diff < windowMs) {
          if (stores[storeIndex].count >= max) {
            setRateLimitHeader(res, stores[storeIndex]);
            done(res);
            return;
          }
          stores[storeIndex].count += 1;
        } else {
          stores[storeIndex].count = 1;
        }

        stores[storeIndex].lastReqAt = newReqAt;
      }

      setRateLimitHeader(res, stores[storeIndex]);
      next();
    } else {
      next();
    }
  }
}