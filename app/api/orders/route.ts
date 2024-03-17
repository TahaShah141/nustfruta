import connectMongo from "@/lib/connectMongo"
import Order from "@/models/order"

export const dynamic = 'force-dynamic'

export async function GET() {

  await connectMongo()

  //populate the orders' items array with the Stock reference and the quantity attached with it  
  const orders = await Order.find().populate("items.stock").sort({date: 1}).exec()

  return Response.json({orders})
}