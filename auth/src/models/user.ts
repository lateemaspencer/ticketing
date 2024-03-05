import mongoose, { mongo } from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are required to create a new user
/*
  Describe what it takes to create a user
*/
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that the user model has
/*
  Describes what the entire collection of user look
  like
  or at least
  Methods associated with the user model
*/
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a user document has
/*
  Describes what properties a single user has
*/
interface UserDoc extends mongoose.Document {
  // an instance of a user has
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    // even if created for the first time isModified will be true
    // hash password if it has been modified
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
