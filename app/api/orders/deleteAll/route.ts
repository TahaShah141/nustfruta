import connectMongo from "@/lib/connectMongo"
import Order from "@/models/order"

export async function GET() {

  await connectMongo()

  const orders = await Order.deleteMany({})
 
  return Response.json({orders})
}