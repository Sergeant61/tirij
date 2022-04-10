const handler = (req, res) => {
  const splited = req.url.split('?')?.[0] || '';
  const _id = splited.substring(splited.lastIndexOf('/')).replace('/', '');
  const result = ActionGetLink(_id);

  res.statusMessage = 'Orientation';
  res.writeHead(result.statusCode || 302, { Location: result.redirectUrl });
  return res.end();
}

WebApp.connectHandlers.use('/l', function (req, res, next) {
  const host = req.headers.host;

  if (host === (Meteor.settings?.public?.rootDomain || null)) {
    handler(req, res);
  } else {
    return next();
  }
});

WebApp.connectHandlers.use('/', function (req, res, next) {
  const host = req.headers.host;

  if (host === (Meteor.settings?.public?.shortLinkDomain || null)) {
    handler(req, res);
  } else {
    return next();
  }
});