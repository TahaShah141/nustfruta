"use client"

import { useEffect, useState } from "react"

const mod = (n: number, m: number) => ((n % m) + m) % m

export const get24HourTime: (time: string) => number = (time) => {

  
  const [timePart, meridian] = time.split(' ')
  const [hours, minutes] = timePart.split(':')

  return (parseInt(hours) + (meridian === 'PM' ? 12 : 0) * 100) + parseInt(minutes)
}

export const get12HourTime: (time: number | undefined) => string = (time) => {

  if (time === undefined) return "Not Selected"
  
  const hours = Math.floor(time / 100)
  const minutes = time % 100

  return `${(mod(hours-1, 12) + 1).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
}

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {type CarouselApi} from "@/components/ui/carousel"
import { Button } from "../ui/button"
import { ClockIcon } from "@radix-ui/react-icons"
import { Card } from "../ui/card"

type TimePickerProps = {
  onChange: (value: number) => void
  promptString: string
  startingTime: number | undefined
}

type TimeDialProps = {
  onChange: (value: number) => void
}

type DigitCarouselProps = {
  onChange: (value: number) => void
  limit?: number
  offset?: number
}

const DigitCarousel: React.FC<DigitCarouselProps> = ({onChange, limit=10, offset=0}) => {
  
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {

    if (!api) return;

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  useEffect(() => {
    onChange(mod(current-offset, limit) + offset)
  }, [current])
  
  return (
    <Carousel setApi={setApi}
    orientation="vertical"
    opts={{align: "start", loop: true}}
    className="">
      <CarouselContent className="h-12">
        {Array.from({length: limit}).map((_, i) => (
          <CarouselItem key={i} className="">
            <Card className="p-1 h-8 aspect-square rounded-sm flex justify-center items-center">
              {mod(i-offset, limit) + offset}
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="h-4 w-4 -top-4" />
      <CarouselNext className="h-4 w-4 -bottom-4" />
    </Carousel>
  )
}

const TimeDial: React.FC<TimeDialProps> = ({onChange}) => {

  const [fullTime, setFullTime] = useState(0)
  const [digits, setDigits] = useState([0, 0, 0])
  const [meridian, setMeridian] = useState('AM')

  useEffect(() => {

    const minutes = digits[0] + digits[1]*10

    let hours = digits[2]

    if (meridian === "AM") {
      if (hours === 12) hours = 0
    } else if (hours !== 12) hours += 12

    const finalTime = hours*100 + minutes

    setFullTime(finalTime)
    onChange(finalTime)

  }, [digits, meridian])

  return (
    <Card className="flex flex-row-reverse justify-center items-center gap-2 p-6 rounded-md">
      <Button size={"icon"} variant="outline" onClick={() => setMeridian(meridian === 'AM' ? 'PM' : 'AM')}>
        {meridian}
      </Button>
      <DigitCarousel
      onChange={(value) => setDigits(d => d.map((digit, index) => index === 0 ? value : digit))}
      /> 
      <DigitCarousel limit={6}
      onChange={(value) => setDigits(d => d.map((digit, index) => index === 1 ? value : digit))}
      /> 
      :
      <DigitCarousel limit={12} offset={1} onChange={(value) => setDigits(d => d.map((digit, index) => index === 2 ? value : digit))} />
    </Card>
  )
}

export const TimePicker: React.FC<TimePickerProps> = ({onChange, promptString, startingTime}) => {
    
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={"w-full justify-start text-left font-normal"}>
          <ClockIcon className="mr-2 h-4 w-4" />
          {get12HourTime(startingTime)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className='flex flex-col gap-2'>
          <div>
            <p className='text-md font-bold'>{promptString}</p>
            <p className='text-sm text-muted-foreground'>Pick the time in 12 hour clock</p>
          </div>
          <TimeDial onChange={(value) => {onChange(value)}} />
        </div>
      </PopoverContent>
    </Popover>
  )
}