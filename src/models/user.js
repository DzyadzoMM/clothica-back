import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      trim: true,
    },
    postOfficeNum: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.pre('save', function (next) {
  if (!this.firstName) {
    this.firstName = this.phone;
  }
  next();
});

// Перевизначаємо метод toJSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
