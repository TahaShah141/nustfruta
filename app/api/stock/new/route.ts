import { NextRequest, NextResponse } from "next/server"
import Stock from "@/models/stock"
import connectMongo from "@/lib/connectMongo"

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: NextRequest) {

  const { stock } = await request.json()

  try {
    await connectMongo()
        
    const newStock = await Stock.create({...stock})
    await newStock.save()

    return NextResponse.json({stock: newStock})
  } catch (error) {
    return NextResponse.json({error})
  }
}