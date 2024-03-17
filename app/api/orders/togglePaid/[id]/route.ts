import connectMongo from "@/lib/connectMongo";
import Order, { OrderType } from "@/models/order";
import { NextRequest } from "next/server";

type RouteParams = {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {

  const { id } = params

  await connectMongo()

  const order = await Order.findById(id)
  const toggledOrder = await Order.findByIdAndUpdate(id, {paid: !order?.paid}, {new: true})

  return Response.json({toggledOrder})
}