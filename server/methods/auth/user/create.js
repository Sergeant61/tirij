import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'user.create',
  schema: new SimpleSchema({
    emailAddress: String,
    password: String,
    plan: { type: String, optional: true },
    profile: UserProfileSchema.omit('isAdmin'),
    store: StoreSchema
  }),
  run: function (data) {
    this.unblock();
    const { emailAddress, password, profile, store } = data

    const userId = Accounts.createUser({
      email: emailAddress,
      password: password,
      profile: profile
    });

    
    Roles.addUsersToRoles(userId, 'permissions.users', null);
    Accounts.sendVerificationEmail(userId);
    ActionStoreCreate(userId, store);
    return ActionSignIn(emailAddress, password);
  }
});