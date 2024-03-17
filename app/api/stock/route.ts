import connectMongo from "@/lib/connectMongo"
import Stock from "@/models/stock"

export async function GET() {

  await connectMongo()

  const stockItems = await Stock.find()
 
  return Response.json({stockItems})
}