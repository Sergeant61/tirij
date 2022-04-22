RequestLinkDatas = {};
const { adPageDisplayTime, shortLinkDomain } = Meteor.settings.public;

Meteor.setInterval(function () {
  Object.keys(RequestLinkDatas).forEach(id => {
    const data = RequestLinkDatas[id];

    if ((new Date() - data.requestAt) > (1000 * 60)) { // 1 minute
      delete RequestLinkDatas[id];

      console.log('Deleted link data ' + id);
    }
  });
}, 1000 * 30); // 1 minute

ActionGetLink = function (_id) {
  let res = { redirectUrl: `${Meteor.absoluteUrl()}error/not-found` };

  let link = Links.findOne({ $or: [{ _id: _id }, { shortId: _id }, { longId: _id }] });
  let plan = null;
  let requestLinkData = null;

  if (!link) {
    requestLinkData = RequestLinkDatas[_id];

    if (requestLinkData) {
      if ((new Date() - requestLinkData.requestAt) > (adPageDisplayTime || 5000)) {
        link = requestLinkData.link;
      }
    }

    if (!link) {
      return res;
    }
  }

  if (!requestLinkData) {
    plan = ActionGetPlan(link);

    switch (plan.type) {
      case 'free':
        const id = Random.id();
        // const to = `${Meteor.absoluteUrl()}l/${id}`;
        const to = `https://${shortLinkDomain}/${id}`;

        RequestLinkDatas[id] = {
          link: link,
          plan: plan,
          to: to,
          requestAt: new Date(),
        }

        res.redirectUrl = `${Meteor.absoluteUrl()}to?to=${to}`;
        return res;
    }
  }

  if (plan) {
    // TODO: 
  }

  switch (link.expireType) {
    case 'never':
      res.redirectUrl = link.longUrl;
      break;
    case 'count':
      if ((link.clickCount?.max || 0) > (link.clickCount?.count || 0)) {
        res.redirectUrl = link.longUrl;
      }
      break;
    case 'date':
      const diff = moment(link.expireAt || new Date()).diff(moment())
      if (diff > 0) {
        res.redirectUrl = link.longUrl;
      }
      break;
  }

  Links.update({ _id: link._id }, {
    $set: {
      'clickCount.count': (link.clickCount?.count || 0) + 1
    }
  });

  if (RequestLinkDatas[_id]) {
    RequestLinkDatas[_id].isViewed = true;
  }

  return res;
}