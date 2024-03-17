"use client"

import { DatePicker } from "@/components/custom/datePicker";
import { StepPicker } from "@/components/custom/stepPicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { StockType } from "@/models/stock";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

const hostelNames = [
  "Ammar", 
  "Amna", 
  "Attar", 
  "Ayesha", 
  "Beruni", 
  "Fatima",
  "Ghazali", 
  "Hajveri", 
  "Johar", 
  "Khadija", 
  "Liaquat", 
  "Razi", 
  "Rehmat", 
  "Rumi", 
  "Zakiriya", 
  "Zainab", 
]

type BillItem = StockType & {quantity: number}

const validNumber: (phone: string) => boolean = (phone) => {
  const regex = /^03\d{9}$/;
  return regex.test(phone);
}

export default function NewOrder() {

  const router = useRouter()

  const BillCard: React.FC<BillItem> = ({name, price, quantity, unit, step}) => {
    return (
      <Card className="flex gap-2 p-4 items-center">
        <p className="flex-1 text-center">{name}</p>
        <Separator orientation={"vertical"}/>
        <p className="flex-1 text-center">{quantity*step} {unit || "Piece"}</p>
        <Separator orientation={"vertical"} />
        <p className="flex-1 text-center">Rs.{price*quantity}</p>
        <Button variant={"ghost"} className="w-8 h-8 p-0" onClick={() => setBill(bill => ({...bill, [name]: {...bill[name], quantity: 0}}))}><Cross1Icon /></Button>
      </Card>
    )
  }

  const [bill, setBill] = useState<Record<string, BillItem>>({})
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [hostel, setHostel] = useState("")
  const [date, setDate] = useState<Date>()

  const orderingToday = date && Math.abs(date.getTime() - Date.now()) <= 86400000 && date.getDate() === new Date().getDate()

  useEffect(() => {
    if (orderingToday) {
      Object.values(bill).forEach(item => {
        if (item.stock !== -1 && item.quantity > item.stock) {
          setBill(bill => ({...bill, [item.name]: {...item, quantity: item.stock}}))
        }
      })
    }
  }, [date])

  const [stock, setStock] = useState<StockType[]>([])

  useEffect(() => {
    const fetchStock = async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "api/stock")
      const {stockItems} = await res.json()

      console.log(stockItems)
      setStock(stockItems)
    }
    fetchStock()
  }, [])

  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const billTotal = Object.values(bill).reduce((a, b) => a + b.price*b.quantity, 0)

  const confirmOrder = async () => {

    const items = Object.values(bill).map(item => ({
      stock: item._id,
      quantity: item.quantity*item.step, 
    })).filter(item => item.quantity !== 0)
    
    const order ={
      customer: name,
      hostel,
      phone,
      date,
      items,
    }

    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "api/orders/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({order})
    })

    if (res.status === 200) {
      setShowPaymentDialog(true)
    }
  }

  return (  
    <Card className="flex flex-col p-2 h-fit gap-2 w-11/12 sm:w-4/5 sm:p-6 sm:gap-4">
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-[90vw] xs:max-w-sm md:max-w-md rounded-md">
          <DialogHeader>
            <DialogTitle>
              Verify Payment
            </DialogTitle>
            <DialogDescription>
              Kindly send money to the account below and send The screenshot to our whatsapp with the order details
            </DialogDescription>
            <Separator />
            <div className="flex flex-col gap-2 xs:gap-4">
              <div className="flex flex-col gap-1 xs:gap-2">
                <div className="flex w-full items-baseline justify-between">
                  <p className="text-lg xs:text-2xl font-semibold">Account Name</p>
                </div>
                <div className="flex w-full items-baseline justify-between">
                  <p className="text-muted-foreground text-xs xs:text-sm italic">Account Number</p>
                  <p className="text-sm xs:text-base">Sadapay</p>
                </div>
              </div>
              <Separator />
              <div className="flex w-full justify-between">
                <p className="text-lg xs:text-2xl font-bold">Order Total</p>
                <p className="text-md xs:text-xl font-semibold">Rs.{billTotal}</p>
              </div>
              <DialogClose className="flex gap-2 w-full">
                <Button className="flex-1 p-4" onClick={() => router.push("/")}>Acknowledged</Button>
              </DialogClose>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <h1 className="font-bold text-xl text-center sm:text-left sm:text-4xl">Place an Order</h1>
      <Separator/>
      <div className="flex lg:flex-row flex-col gap-2">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
        <Input placeholder="03xxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)}/>
        <Select value={hostel} onValueChange={setHostel}>
          <SelectTrigger className={`${hostel ? "" : "text-muted-foreground"}`}>
            <SelectValue placeholder="Hostel" />
          </SelectTrigger>
          <SelectContent>
            {hostelNames.map((hostel) => (
              <SelectItem key={hostel} value={hostel}>
                {hostel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePicker onChange={(date) => {setDate(d => date)}} future={true}/>
      </div>
      <Separator />
      <div className="flex xl:flex-row flex-col gap-4">
        <div className="flex-[3_0_0]">

        <ScrollArea className="h-[50vh] md:h-[69vh] w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-2 min-[1450px]:grid-cols-3 sm:gap-3 gap-2">
            {stock.map((item) => 
              <Card className="flex sm:flex-col sm:justify-between items-center gap-3 sm:gap-2 p-3" key={item.name}>
                <div className="flex justify-between w-full">
                  <p className="text-sm xl:text-base">{item.name}</p>
                  <Badge className="w-[4.5rem] justify-center" variant={"default"}>Rs.{item.price}</Badge>
                </div>
                <div className="flex sm:flex-row-reverse gap-4 justify-between w-full">
                  {(orderingToday && item.stock !== -1) ? <Badge variant={item.stock ? "secondary" : "destructive"} className="w-[4.5rem] justify-center">{`${item.stock ? `${item.stock} Left` : "Sold Out"}`}</Badge> : <div className="flex-1"></div>}
                  <StepPicker value={bill[item.name]?.quantity || 0} onChange={(quantity) => setBill(b => ({...b, [item.name]: {...item, quantity}}))} max={item.stock !== -1 && orderingToday ? item.stock : undefined}/>
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>
        </div>
        <Separator orientation={"vertical"} className="hidden sm:block" />
        <div className="flex-[2_0_0] flex flex-col gap-2">
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="text-2xl font-semibold text-center">Order Summary</h2>
            <ScrollArea className="h-[48vh]">
              <div className="flex flex-col gap-2 ">
                {Object.keys(bill).map(itemName => (bill[itemName].quantity > 0 && <BillCard key={itemName} {...bill[itemName]} />))}
              </div>
            </ScrollArea>
          </div>
          <Separator />
          <div className="flex gap-2 justify-between p-2">
            <div className="flex items-end gap-4">
              <h1 className="text-3xl font-bold">Total:</h1>
              <p className="text-xl">Rs.{billTotal}</p>
            </div>
            <Dialog>
              <DialogTrigger 
              disabled={billTotal === 0 || !name || !hostel || !date || !phone || !validNumber(phone)}
              >
                Place Order
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] xs:max-w-sm md:max-w-md rounded-md">
                <DialogHeader>
                  <DialogTitle>
                    Confirm Order
                  </DialogTitle>
                  <DialogDescription>
                    Make sure all the information is correct
                  </DialogDescription>
                  <Separator />
                  <div className="flex flex-col gap-2 xs:gap-4">
                    <div className="flex flex-col gap-1 xs:gap-2">
                      <div className="flex w-full items-baseline justify-between">
                        <p className="text-lg xs:text-2xl font-semibold">{name}</p>
                        <p className="text-sm xs:text-base">{`${hostel} Hostel`}</p>
                      </div>
                      <div className="flex w-full items-baseline justify-between">
                        <p className="text-muted-foreground text-xs xs:text-sm italic">{phone}</p>
                        <p className="text-muted-foreground text-xs xs:text-sm">{date ? format(date, "PPP") : "Tomorrow"}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex w-full justify-between">
                      <p className="text-lg xs:text-2xl font-bold">Order Total</p>
                      <p className="text-md xs:text-xl font-semibold">Rs.{billTotal}</p>
                    </div>
                    <DialogClose className="flex gap-2 w-full">
                      <Button className="flex-1 p-4" onClick={confirmOrder}>Confirm</Button>
                    </DialogClose>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>            
          </div>
        </div>
      </div>
    </Card>
  );
}