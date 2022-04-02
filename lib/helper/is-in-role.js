export default isInRole = (role, scope = Roles.GLOBAL_GROUP) => {
  return Roles.userIsInRole(Meteor.userId(), role, scope);
}