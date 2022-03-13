const handler = (req, res) => {
  const splited = req.url.split('?')?.[0] || '';
  const _id = splited.substring(splited.lastIndexOf('/')).replace('/', '');
  const longUrl = ActionShortLinkFind(_id);

  res.statusMessage = 'Orientation';
  if (longUrl) {
    res.writeHead(302, {
      Location: longUrl
    })
    return res.end();
  } else {
    res.writeHead(302, {
      Location: `${Meteor.absoluteUrl()}error/not-found`
    })
    return res.end();
  }
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