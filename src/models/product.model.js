import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    index: "text" 
  },
  thumbnail: { 
    type: String, 
    default: "" 
  },
  code: { 
    type: String, 
    unique: true, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  stock: { 
    type: Number, 
    default: 0 
  },
  category: { 
    type: String, 
    index: true 
  },
  status: {
    type: Boolean,
    default: true,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

export default Product;