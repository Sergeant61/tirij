import { hashSync } from 'bcrypt';

const checkUser = function () {
  if (!Meteor.userId()) {
    throw new Meteor.Error(401, 'You must be logged in to do this!');
  }
}

Meteor.methods({
  'mor.apiKeys.create': function () {
    checkUser();
    const count = ApiKeys.find({ createdUserId: Meteor.userId() }).count();

    if (count >= 5) {
      throw new Meteor.Error('error', 'You can create up to 5 API keys.');
    }

    const publicKey = Random.secret();
    const secretKey = Random.secret();

    const obj = {
      publicKey: publicKey,
      secretKey: hashSync(secretKey, 10),
      secretKeyLastPrefix: secretKey.substring(secretKey.length - 5)
    }

    const _id = ApiKeys.insert(obj);
    const apiKey = ApiKeys.findOne({ _id: _id });
    apiKey.secretKey = secretKey;

    return apiKey;
  },
  'mor.apiKeys.delete': function (_id) {
    checkUser();
    ApiKeys.remove({ _id: _id, createdUserId: Meteor.userId() });
  },
  'mor.apiKeys.list': function (_id) {
    checkUser();
    const apiKeys = ApiKeys.find({ createdUserId: Meteor.userId() }, { sort: { createdAt: -1 } }).fetch();

    return apiKeys.map(apiKey => {
      delete apiKey.secretKey;
      return apiKey;
    })
  }
});