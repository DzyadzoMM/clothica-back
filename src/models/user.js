import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, unique: true }, 
    googleId: { type: String, unique: true, sparse: true },
    phone: { type: String, trim: true, unique: true, sparse: true }, 
    password: { type: String, required: false },
    city: { type: String, trim: true },
    postOfficeNum: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false },
);

userSchema.pre('save', function (next) {
  if (!this.firstName) {
    this.firstName = this.phone || this.email || 'User';
  }
  next();
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
