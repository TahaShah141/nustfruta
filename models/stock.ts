import mongoose from "mongoose"

export type StockItem = {
  name: string
  price: number
  unit: string
  step: number
  stock: number
}

export type StockType = {
  _id: mongoose.Types.ObjectId 
} & StockItem

const StockSchema = new mongoose.Schema<StockType>({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String
  },
  step: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: -1
  }
})

export default mongoose.models.Stock || mongoose.model<StockType>("Stock", StockSchema)

