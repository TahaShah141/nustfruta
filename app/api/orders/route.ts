import connectMongo from "@/lib/connectMongo"
import Order from "@/models/order"
export async function GET() {

  await connectMongo()

  //populate the orders' items array with the Stock reference and the quantity attached with it  
  const orders = await Order.find().populate("items.stock").sort({date: 1})

  return Response.json({orders})
}