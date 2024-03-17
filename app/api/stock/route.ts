import connectMongo from "@/lib/connectMongo"
import Stock from "@/models/stock"

export const dynamic = 'force-dynamic'
export async function GET() {

  await connectMongo()

  const stockItems = await Stock.find().exec()
 
  return Response.json({stockItems})
}