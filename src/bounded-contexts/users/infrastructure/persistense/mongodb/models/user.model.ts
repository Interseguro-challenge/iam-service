import { Schema, model, Document } from 'mongoose';
import { UserType } from '../../../../domain/enums/user-type';

export interface UserDocument extends Document {
  _id: string;
  email: string;
  password: string;
  type: UserType;
}

const userSchema = new Schema<UserDocument>(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, enum: Object.values(UserType), required: true }
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<UserDocument>('User', userSchema);
