import SimpleSchema from 'simpl-schema';
import { hashSync, compareSync } from 'bcrypt';

new ValidatedMethod({
  name: 'auth.signin',
  schema: new SimpleSchema({
    email: String,
    password: String,
  }),
  run: function (data) {
    return ActionSignIn(data.email, data.password);
  }
});
