"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  onChange?: (date: Date) => void
  future?: boolean
  blank?: boolean
}

export const DatePicker: React.FC<Props> = ({onChange, future=false, blank=false}) => {
  const [date, setDate] = React.useState<Date | undefined>(blank ? undefined : new Date())

  React.useEffect(() => {
    if (date && onChange && (!future || date.getTime() >= Date.now() - 86400000))  onChange(date)
  }, [date])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {if (date && (!future || date.getTime() >= Date.now() - 86400000)) setDate(date); else setDate(blank ? undefined : new Date())}}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
