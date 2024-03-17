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

  const deletedOrder = await Order.findByIdAndDelete(id)

  return Response.json({deletedOrder})
}