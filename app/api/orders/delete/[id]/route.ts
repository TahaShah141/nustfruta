import connectMongo from "@/lib/connectMongo";
import Order, { OrderType } from "@/models/order";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'

type RouteParams = {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {

  const { id } = params

  await connectMongo()

  const deletedOrder = await Order.findByIdAndDelete(id).exec()

  return Response.json({deletedOrder})
}