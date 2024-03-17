import { NextRequest, NextResponse } from "next/server"
import Stock from "@/models/stock"
import connectMongo from "@/lib/connectMongo"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {

  const { stock } = await request.json()

  try {
    await connectMongo()

    for (const stockItem of stock) {
      await Stock.findByIdAndUpdate(stockItem._id, {...stockItem}, {new: true}).exec()
    }

    const newStock = await Stock.find().exec()

    return NextResponse.json({stock: newStock})
  } catch (error) {
    return NextResponse.json({error})
  }
}
