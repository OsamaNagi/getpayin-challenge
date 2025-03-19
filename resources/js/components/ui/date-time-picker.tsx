import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateTimePickerProps {
  date: Date
  setDate: (date: Date) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i)
  const hourOptions = Array.from({ length: 24 }, (_, i) => i)

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
          {date ? format(date, "PPP p") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          initialFocus
        />
        <div className="border-t border-border p-3 space-y-2">
          <div className="flex items-center justify-between space-x-2">
            <Select
              value={date ? date.getHours().toString() : ""}
              onValueChange={(value) => {
                const newDate = new Date(date)
                newDate.setHours(parseInt(value))
                setDate(newDate)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent position="popper">
                {hourOptions.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>:</span>
            <Select
              value={date ? date.getMinutes().toString() : ""}
              onValueChange={(value) => {
                const newDate = new Date(date)
                newDate.setMinutes(parseInt(value))
                setDate(newDate)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent position="popper">
                {minuteOptions.map((minute) => (
                  <SelectItem key={minute} value={minute.toString()}>
                    {minute.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 