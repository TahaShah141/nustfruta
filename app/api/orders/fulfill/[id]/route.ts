import connectMongo from "@/lib/connectMongo";
import Order from "@/models/order";
import { NextRequest } from "next/server";

type RouteParams = {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {

  const { id } = params

  await connectMongo()

  const fulfilledOrder = await Order.findByIdAndUpdate(id, {fulfilled: true}, {new: true})

  return Response.json({fulfilledOrder})
}