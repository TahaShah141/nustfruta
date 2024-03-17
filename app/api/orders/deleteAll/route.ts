import connectMongo from "@/lib/connectMongo"
import Order from "@/models/order"

export const dynamic = 'force-dynamic'

export async function GET() {

  await connectMongo()

  const orders = await Order.deleteMany({}).exec()
 
  return Response.json({orders})
}