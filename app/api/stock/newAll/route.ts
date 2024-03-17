import connectMongo from "@/lib/connectMongo"
import { stockItems } from "@/lib/menuItems"
import Stock, { StockType } from "@/models/stock"

export async function GET() {

  await connectMongo()

  const oldStock = await Stock.deleteMany({})

  const stock: StockType[] = []

  for (const stockItem of stockItems) {
    const newStockItem = await Stock.create({...stockItem})
    await newStockItem.save()

    stock.push(newStockItem as StockType)
  }
 
  return Response.json({stock})
}