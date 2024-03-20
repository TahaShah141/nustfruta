import { NextRequest, NextResponse } from "next/server"
import Order, { OrderType } from "@/models/order"
import connectMongo from "@/lib/connectMongo"
import Stock from "@/models/stock"

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: NextRequest) {

  const { order } = await request.json()

  try {
    await connectMongo()
        
    const newOrder = await Order.create({...order})
    await newOrder.save()

    if (Math.abs(newOrder.date.getTime() - Date.now()) <= 86400000 && newOrder.date.getDate() === new Date().getDate()) {
      const expandedOrder = await Order.findById(newOrder._id).populate("items.stock")

      for (const item of expandedOrder?.items) {
        if (item.stock.stock !== -1) {
          await Stock.findByIdAndUpdate(item.stock._id, {stock: item.stock.stock - item.quantity/item.stock.step}).exec()
        }
      }
    }

    return NextResponse.json({order: newOrder})
  } catch (error) {
    return NextResponse.json({error})
  }
}