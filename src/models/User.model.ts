import mongoose, { Schema, Model, model } from "mongoose";
import { IUser } from "../shared/interfaces/IUser.js";
import { AvailabilitySchema } from "../schemas/Availability.schema.js";

const UserSchema = new Schema<IUser>({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return this._id.toString();
    },
    description: "Unique identifier for the user"
  },  
  username: { type: String, required: true },
  passwordHash: { type: String },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  googleId: { type: String },
  profilePicture: { type: String },
  lastLoginAt: { type: Date },
  role: {
    type: String,
    required: true,
    enum: ["employee", "manager", "admin"],
    default: "employee",
  },
  weeklyAvailability: {
    type: [AvailabilitySchema],
    required: function () {
      return this.role === "employee";
    },
  },
});

const UserModel: Model<IUser> = model<IUser>("User", UserSchema);
export default UserModel;