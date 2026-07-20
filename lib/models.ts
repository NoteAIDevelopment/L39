import { Schema, model, models } from "mongoose";

const bookingSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    preferredDate: { type: String, required: true },
    experience: { type: String, required: true },
    passengers: { type: Number, required: true },
    giftVoucher: { type: Boolean, default: false },
    notes: { type: String },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true },
);

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["Customer", "Staff", "Administrator"], default: "Customer" },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const voucherSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    balance: { type: Number, default: 1 },
    status: { type: String, default: "Active" },
  },
  { timestamps: true },
);

const reviewSchema = new Schema(
  {
    name: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, default: 5 },
  },
  { timestamps: true },
);

const messageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export const Booking = models.Booking || model("Booking", bookingSchema);
export const User = models.User || model("User", userSchema);
export const GiftVoucher = models.GiftVoucher || model("GiftVoucher", voucherSchema);
export const Review = models.Review || model("Review", reviewSchema);
export const Message = models.Message || model("Message", messageSchema);
