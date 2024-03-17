"use client"

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { OrderType } from '@/models/order'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from 'date-fns'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DotsHorizontalIcon, DotsVerticalIcon } from '@radix-ui/react-icons'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loading } from '@/components/custom/loading'
import { StockItem, StockType } from '@/models/stock'
import { Switch } from '@/components/ui/switch'
import { StepPicker } from '@/components/custom/stepPicker'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

type StockDislayType = {
  name: string
  price: number
  unit: string
}

type BillItem = {
  stock: StockDislayType
  quantity: number
}

type OrderBill = {
  date: string
  items: BillItem[]
}

const getOrders: () => Promise<{orders: OrderType[]}> = async () => {

  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "api/orders", {
  })

  return res.json()
}

const getStock: () => Promise<{stockItems: StockType[]}> = async () => {

  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "api/stock", {
    cache: "no-store"
  })

  return res.json()
}

const saveStock: (stock: StockType[], onSaveComplete: () => void) => Promise<StockType[]> = async (stock, onSaveComplete) => {

  console.log("Saving Stock")
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "api/stock/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({stock})
  })

  const { stock: newStock } = await res.json()

  onSaveComplete()

  return newStock
}

const getInventory: (orders: OrderType[]) => OrderBill[] = (orders) => {

  const dates: Record<string, Record<string, BillItem>> = {}

  for (const order of orders) {
    if (!dates[format(order.date, "PPP")]) {
      dates[format(order.date, "PPP")] = {}
    }
    const dateBill = dates[format(order.date, "PPP")]
    for (const stockItem of order.items) {
      const item = stockItem.stock
      if (!dateBill[item.name]) {
        dateBill[item.name] = {
          stock: {
            name: item.name,
            price: item.price,
            unit: item.unit
          },
          quantity: stockItem.quantity,
        }
      } else {
        dateBill[item.name].quantity += stockItem.quantity
      }

    }
  }

  const sortedDateKeys = Object.keys(dates).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime()
  })

  return sortedDateKeys.map(date => ({
    date,
    items: Object.values(dates[date])
  }))
}

const BillTable: React.FC<{bills: OrderBill[]}> = ({bills}) => {
  if (bills.length === 0) return (<p className='text-center text-muted-foreground italic text-2xl'>No Orders Yet</p>)

  return (
    <>
    {bills.map((bill, i) => (
      <Accordion key={bill.date} type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="">
            <p className='text-xs sm:text-base'>{bill.date}</p>
          </AccordionTrigger>
          <AccordionContent>
            <div className='w-full flex flex-wrap justify-center gap-2 p-2'>
              {bill.items.map(item => (
                <Card className='flex gap-4 p-4' key={`${bill.date} ${item.stock.name}`}>
                  <p className='text-xs sm:text-base'>{item.stock.name}</p>
                  <p className='text-xs sm:text-base'>{`${item.quantity} ${item.stock.unit}`}</p>
                  <p className='text-xs sm:text-base'>Rs.{item.stock.price}</p>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ))}
    </>
  )
}

const OrderTable: React.FC<{orders: OrderType[], change: (action: string, id: string) => void}> = ({orders, change}) => {

  if (orders.length === 0) return (<p className='text-center text-muted-foreground italic text-2xl'>No Orders Yet</p>)

  return (
    <>
    {orders.map((order, i) => (
      <Accordion key={order._id.toString()} type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="">
            <div className='w-full flex flex-col xs:flex-row items-center gap-2 p-2'>
              <Badge className={`${order.paid ? "bg-green-500" : "bg-red-500"} w-16 justify-center xs:hidden`} onClick={(e) => e.stopPropagation()} >{order.paid ? "Paid" : "Unpaid"}</Badge>
              <p className='hidden md:block'>{`${i+1}.`}</p>
              <p className='flex-1 text-center text-xs sm:text-base'>{order.customer}</p>
              <p className='flex-1 text-center text-xs sm:text-base'>{`${order.hostel} Hostel`}</p>
              <p className='flex-1 text-center text-xs sm:text-base'>{order.phone}</p>
              <p className='flex-1 text-center xs:hidden sm:block text-xs sm:text-base'>{format(order.date, "PPP")}</p>
              <p className='flex-1 text-center hidden xs:block sm:hidden text-xs sm:text-base'>{`${new Date(order.date).getDay()}/${new Date(order.date).getMonth()}/${new Date(order.date).getFullYear()}`}</p>
              <Badge className={`${order.paid ? "bg-green-500" : "bg-red-500"} w-16 justify-center hidden md:block`} onClick={(e) => e.stopPropagation()} >{order.paid ? "Paid" : "Unpaid"}</Badge>
              {!order.fulfilled && <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size={"icon"}><DotsVerticalIcon className='hidden xs:block' /><DotsHorizontalIcon className='xs:hidden' /> </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent  onClick={(e) => {e.stopPropagation();}} className="w-48 mx-2 p-2">
                  <DropdownMenuLabel>Order Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => change("togglePaid", order._id.toString())}>
                    {order.paid ? "Mark as Unpaid" : "Mark as Paid"}
                  </DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger asChild className={`${order.paid ? "text-green-500 hover:bg-green-500/10" : "text-destructive hover:bg-destructive/10"} w-full`}>
                      {order.paid ? "Fulfill Order" : "Delete Order"}
                    </DialogTrigger>
                    <DialogContent className='max-w-[300px] sm:max-w-sm rounded-md'>
                      <DialogHeader>
                        <DialogTitle>Confirm Action</DialogTitle>
                        <DialogDescription>Are you sure you want to continue?</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose className='flex w-full gap-2'>
                          <Button className='flex-1' variant="outline">Cancel</Button>
                          <Button className='flex-1' onClick={() => {change(order.paid ? "fulfill" : "delete", order._id.toString())}}>Confirm</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuContent>
              </DropdownMenu>}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className='w-full flex flex-wrap justify-center gap-2 p-2'>
              {order.items.map(item => (
                <Card className='flex gap-4 p-4' key={`${order._id} ${item.stock.name}`}>
                  <p className='text-xs sm:text-base'>{item.stock.name}</p>
                  <p className='text-xs sm:text-base'>{`${item.quantity} ${item.stock.unit}`}</p>
                  <p className='text-xs sm:text-base'>Rs.{item.stock.price}</p>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ))}
    </>
  )
}

const getFutureOrders: (orders: OrderType[]) => OrderType[] = (orders) => {
  
  const cutOffIndex = orders.findIndex(order => {
    const orderDate = new Date(order.date).getTime()
    const today = Date.now()
    return orderDate >= today - 86400000
  })

  if (cutOffIndex === -1) return []
  else return orders.slice(cutOffIndex)
}

const Orders = () => {

  const [allOrders, setAllOrders] = useState<OrderType[]>([])
  const [stock, setStock] = useState<StockType[]>([])
  const [loading, setLoading] = useState(true)

  const orders = getFutureOrders(allOrders)
  const { toast } = useToast()

  const onSaveComplete = () => {
    toast({
      description: "Stock Updated Successfully",
    })

    console.log(stock)
  }

  const changeOrders = async (action: string, id: string) => {
    switch (action) {
      case "fulfill": {
        const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "api/orders/fulfill/" + id)
        const { fulfilledOrder } = await res.json()
        if (fulfilledOrder._id)
        return setAllOrders(allOrders.map(order => order._id.toString() === fulfilledOrder._id.toString() ? fulfilledOrder : order))
      }
      case "delete": {
        const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "api/orders/delete/" + id)
        const { deletedOrder } = await res.json()
        if (deletedOrder._id)
        return setAllOrders(allOrders.filter(order => order._id.toString() !== deletedOrder._id.toString()))
      }
      case "togglePaid": {
        const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "api/orders/togglePaid/" + id)
        const { toggledOrder } = await res.json()
        if (toggledOrder._id)
        return setAllOrders(allOrders.map(order => order._id.toString() === toggledOrder._id.toString() ? toggledOrder : order))
      }

      default:
        return
    }
  }

  useEffect(() => {
    getOrders().then(({orders}) => {console.log(orders); setAllOrders(orders); setLoading(false)})
    getStock().then(({stockItems}) => setStock(stockItems))
  }, [])

  return (
    <>
    {loading ? <Loading /> : <Tabs defaultValue="pending" className="flex flex-col w-full p-4 gap-2">
      <TabsList className="grid self-center w-11/12 sm:w-1/2 grid-cols-3">
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
      </TabsList>
      <TabsContent className='w-full' value="pending">
        <PendingOrders changeOrders={changeOrders} orders={orders.filter(order => !order.fulfilled)} />
      </TabsContent>
      <TabsContent value="fulfilled">
        <div className='flex flex-col w-full gap-2'>
          <OrderTable change={changeOrders} orders={allOrders.filter(order => order.fulfilled)} />
        </div>
      </TabsContent>
      <TabsContent value="inventory">
        <Inventory onSaveComplete={onSaveComplete} bills={getInventory(orders.filter(order => !order.fulfilled))} stock={stock} setStock={setStock}/>
        <Toaster />
      </TabsContent>
    </Tabs>}
    </>
  )
}

const Inventory: React.FC<{bills: OrderBill[], stock: StockType[], setStock: Dispatch<SetStateAction<StockType[]>>, onSaveComplete: () => void}> = ({bills, stock, setStock, onSaveComplete}) => {
  
  const [loading, setLoading] = useState(false)

  return (
    <Tabs defaultValue="grocery" className="flex flex-col w-full gap-2">
      <TabsList className="grid self-center w-3/4 sm:w-2/5 grid-cols-2">
        <TabsTrigger value="grocery">Grocery</TabsTrigger>
        <TabsTrigger value="stock">Stock</TabsTrigger>
      </TabsList>
      <TabsContent className='' value="grocery">
        <div className='flex flex-col w-full gap-2'>
          <BillTable bills={bills} />
        </div>
      </TabsContent>
      <TabsContent className='p-8' value="stock">
        <div className="flex flex-col w-full gap-8">
          <div className='flex flex-col w-full gap-2'>
            {stock.map(stockItem => 
            <Card className='p-4 flex gap-2 justify-between items-center' key={stockItem._id.toString()}>
              <Switch checked={stockItem.stock !== -1} onCheckedChange={(checked) => setStock(stock.map(stock => stock._id.toString() === stockItem._id.toString() ? {...stock, stock: checked ? 0 : -1} : stock))} />
              <div className='flex flex-1 sm:flex-[2_0_0] gap-2 flex-col sm:flex-row'>
                <p className='flex-1 text-center'>{stockItem.name}</p>
                <div className='flex-1 flex justify-center w-full'>
                  <StepPicker value={stockItem.price} onChange={(newPrice) => setStock(stock.map(stock => stock._id.toString() === stockItem._id.toString() ? {...stock, price: newPrice} : stock))} step={5} />
                </div>
              </div>
              {stockItem.stock !== -1 ? 
              <div className='flex gap-2 justify-center items-center flex-1 flex-col sm:flex-row'>
                <StepPicker display={stockItem.stock*stockItem.step} value={stockItem.stock} onChange={(newStock) => setStock(stock.map(stock => stock._id.toString() === stockItem._id.toString() ? {...stock, stock: newStock} : stock))} step={1} />
                <p className='text-center'>{stockItem.unit}</p>
              </div>:
              <div className='flex gap-2 justify-center items-center flex-1 flex-col sm:flex-row'>
                <p className='text-center'>Unlimited</p>
                <p className='text-center'>{stockItem.unit}</p>
              </div>}
            </Card>)}
          </div>
          <div className='w-full flex gap-4 justify-center'>
            <Button className='w-64' disabled={loading} onClick={() => {setLoading(true); getStock().then(({stockItems}) => {setStock(stockItems); setLoading(false)})}} variant="outline">Cancel</Button>
            <Button className='w-64' disabled={loading} onClick={() => {setLoading(true) ;saveStock(stock, onSaveComplete).then(() => setLoading(false))}} >Save</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

const PendingOrders: React.FC<{orders: OrderType[], changeOrders: (action: string, id: string) => void}> = ({orders, changeOrders}) => {
  return (
    <Tabs defaultValue="all" className="flex flex-col w-full gap-2">
      <TabsList className="grid self-center w-3/4 sm:w-2/5 grid-cols-3">
        <TabsTrigger value="all">All Orders</TabsTrigger>
        <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
        <TabsTrigger value="paid">Paid</TabsTrigger>
      </TabsList>
      <TabsContent className='' value="all">
        <div className='flex flex-col w-full gap-2'>
          <OrderTable change={changeOrders} orders={orders} />
        </div>
      </TabsContent>
      <TabsContent value="unpaid">
        <div className='flex flex-col w-full gap-2'>
          <OrderTable change={changeOrders} orders={orders.filter(order => !order.paid)} />
        </div>
      </TabsContent>
      <TabsContent value="paid">
        <div className='flex flex-col w-full gap-2'>
          <OrderTable change={changeOrders} orders={orders.filter(order => order.paid)} />
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default Orders