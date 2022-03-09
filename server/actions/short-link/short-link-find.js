ActionShortLinkFind = function (_id) {
  let longLink = null;

  console.log(_id);
  const link = Links.findOne({ $or: [{ _id: _id }, { shortId: _id }] });

  if (!link) {
    return longLink;
  }

  switch (link.expireType) {
    case 'never':
      longLink = link.longUrl;
      break;
    case 'count':
      if (link.maxClickCount > (link.clickCount?.count || 0)) {
        longLink = link.longUrl;
      }
      break;
    case 'date':
      const diff = moment(link.expireAt || new Date()).diff(moment())
      if (diff > 0) {
        longLink = link.longUrl;
      }
      break;
  }

  Links.update({ _id: _id }, {
    $set: {
      'clickCount.count': (link.clickCount?.count || 0) + 1
    }
  });

  return longLink;
}