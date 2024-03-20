import connectMongo from "@/lib/connectMongo"
import Order from "@/models/order"

export const dynamic = 'force-dynamic'

export async function GET() {

  await connectMongo()

  const orders = await Order.find().populate("items.stock").sort({
    date: 1, 
    // deliveryTime: 1, 
    createdAt: 1
  }).exec()

  return Response.json({orders})
}