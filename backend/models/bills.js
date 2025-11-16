// import mongoose from "mongoose";

// const BillSchema = new mongoose.Schema({
//   userId: {
//     type: String,       // stored from req.user.id
//     required: true
//   },
//   tourId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Tour",
//     required: true
//   },
//   quantity: {
//     type: Number,
//     default: 1,
//     required: true
//   },
//   totalPrice: {
//     type: Number,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// export default mongoose.models.bills || mongoose.model("bills", BillSchema);
