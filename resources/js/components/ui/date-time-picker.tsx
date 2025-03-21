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
  
  // Create a display date that's 2 hours behind the actual date
  const displayDate = date ? new Date(date.getTime()) : new Date();
  if (date) {
    displayDate.setHours(date.getHours() - 2);
  }
  
  // When setting a date, add 2 hours to compensate
  const handleSetDate = (newDate: Date) => {
    const adjustedDate = new Date(newDate.getTime());
    adjustedDate.setHours(newDate.getHours() + 2);
    setDate(adjustedDate);
  }
  
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
          {date ? format(displayDate, "PPP p") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={displayDate}
          onSelect={(newDate) => newDate && handleSetDate(newDate)}
          initialFocus
        />
        <div className="border-t border-border p-3 space-y-2">
          <div className="flex items-center justify-between space-x-2">
            <Select
              value={displayDate ? displayDate.getHours().toString() : ""}
              onValueChange={(value) => {
                const newDate = new Date(displayDate);
                newDate.setHours(parseInt(value));
                handleSetDate(newDate);
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
              value={displayDate ? displayDate.getMinutes().toString() : ""}
              onValueChange={(value) => {
                const newDate = new Date(displayDate);
                newDate.setMinutes(parseInt(value));
                handleSetDate(newDate);
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