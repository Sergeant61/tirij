RoleMixin = function (methodOptions) {
  const roles = methodOptions.roles;
  const runFunc = methodOptions.run;

  methodOptions.run = function (_data) {
    const userId = this.userId;

    if (!userId) {
      ErrorHandler('unauthorized', i18n.__('utils', 'signedInMixinError'));
    }

    let isInRole = Roles.userIsInRole(userId, 'roles.admin');

    if (!isInRole) {
      const group = _data.slug || Roles.GLOBAL_GROUP;
      isInRole = Roles.userIsInRole(userId, roles, group);
    }

    if (!isInRole) {
      console.log(methodOptions.name);
      ErrorHandler('forbidden', i18n.__('utils', 'roleMixinError'));
    }

    return runFunc.call(this, ...arguments);
  }
  return methodOptions;
}