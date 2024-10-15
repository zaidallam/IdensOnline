"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = ["00", "15", "30", "45"];

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [selectedHour, setSelectedHour] = React.useState(value?.split(":")[0] ?? "00");
  const [selectedMinute, setSelectedMinute] = React.useState(value?.split(":")[1] ?? "00");

  const handleSelectHour = (hour: string) => {
    setSelectedHour(hour);
    updateTime(hour, selectedMinute);
  };

  const handleSelectMinute = (minute: string) => {
    setSelectedMinute(minute);
    updateTime(selectedHour, minute);
  };

  const updateTime = (hour: string, minute: string) => {
    const newTime = `${hour}:${minute}`;
    onChange(newTime);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {selectedHour}:{selectedMinute}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-4 flex justify-between">
        <div className="w-1/2">
          <Select onValueChange={handleSelectHour} defaultValue={selectedHour}>
            <SelectTrigger>
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/2">
          <Select onValueChange={handleSelectMinute} defaultValue={selectedMinute}>
            <SelectTrigger>
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}