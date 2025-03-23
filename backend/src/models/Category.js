import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  unitPrice: { type: Number, required: true }, // Price per unit
  unitType: { type: String, required: true, enum: ["liter", "kilogram", "piece", "gram", "dozen"] },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
