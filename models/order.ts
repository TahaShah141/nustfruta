import mongoose from "mongoose"
import { StockType } from "./stock"

export type OrderType = {
  _id: mongoose.Schema.Types.ObjectId
  customer: string
  hostel: string
  phone: string
  date: Date
  items: {stock: StockType, quantity: number}[]
  paid: boolean
  fulfilled: boolean
}

const OrderSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true
  },
  hostel: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  items: {
    type: [{
      stock: {
        type: mongoose.Types.ObjectId,
        ref: 'Stock',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }],
  },
  paid: {
    type: Boolean,
    default: false
  },
  fulfilled: {
    type: Boolean,
    default: false
  }
})

export default mongoose.models.Order || mongoose.model<OrderType>("Order", OrderSchema)