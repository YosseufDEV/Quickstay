import { Calendar as C } from '@/Components/ui/calendar';
import { CalendarArrowDown, CalendarArrowUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import IconText from '../IconText/IconText';

/**
 * Gets all days before or after a given date until the end of the month
 * @param mode - 'before' or 'after'
 * @param date - The reference date
 * @returns Array of Date objects
 */
function getDaysUntilMonthEnd(
  mode: 'before' | 'after',
  date: Date
): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Get the last day of the current month
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const result: Date[] = [];

  if (mode === 'before') {
    // Get all days from 1st to the day before the given date
    for (let i = 1; i <= day; i++) {
      result.push(new Date(year, month, i));
    }
    // Return in descending order (most recent first)
    result.reverse();
  } else if (mode === 'after') {
    // Get all days from the day after the given date to the last day of the month
    for (let i = day; i <= lastDayOfMonth; i++) {
      result.push(new Date(year, month, i));
    }
  }

  return result;
}

interface CalendarProps {
    selected: Date | undefined;
    onSelect: (date: Date) => void;
    disabledDates: Date[];
    startMonth?: Date;
    endMonth?: Date;
    defaultMonth?: Date;
}

const Calendar = ({ selected, onSelect, disabledDates, startMonth, endMonth, defaultMonth }: CalendarProps) => {
    return <C
            mode="single"
            selected={selected}
            startMonth={startMonth}
            defaultMonth={defaultMonth}
            endMonth={endMonth}
            modifiers={{
                booked: disabledDates,
            }}
            modifiersClassNames={{
                booked: "[&>button]:line-through opacity-100",
            }}
            disabled={disabledDates}
            onSelect={onSelect}
            className="z-80 absolute m-0 rounded-lg border bottom-7"
      /> 
}

const DatePicker = ({ range, setRange }) => {
    const [visible, setVisible] = useState<{ from: boolean, to: boolean}>({ from: false, to: false });

    const pickersRefs = [
        useRef(null as HTMLDivElement | null),
        useRef(null as HTMLDivElement | null)
    ]

    const disabledDates = {
        beforeFrom: range?.from ? getDaysUntilMonthEnd('before', range.from) : [],
        afterTo: range?.to ? getDaysUntilMonthEnd('after', range.to) : []
    }

    const dateOpts = { year: 'numeric', month: 'short', day: 'numeric' } as const;

    // FIXME: Correct the logic for closing the calendar when clicking outside of it, it currently doesn't work in container, and the contaienr itself takes a lot of space.
    const handleClickOutside = (e: MouseEvent) => {
        if (pickersRefs.every(r => r.current && !r.current.contains(e.target as Node))) {
            setVisible({ from: false, to: false });
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full px-20 py-7 font-[Outfit] inset-shadow-sm shadow-md rounded-xl flex justify-between items-center">
            <div ref={pickersRefs[0]} className="relative flex space-y-2 flex-col w-full" onClick={() => setVisible({ to: false, from: true })}>
                <IconText Icon={CalendarArrowUp} fontSize={15} text="Check-iIn" iconClassName="stroke-gray-700" />
                <p className="text-gray-700 m-0">{range?.from ? range?.from.toLocaleDateString('en-US', dateOpts) : "Pick Date"}</p>

                {visible.from && 
                    <Calendar
                        endMonth={range?.to}
                        defaultMonth={range?.from}
                        disabledDates={disabledDates.afterTo}
                        selected={range?.from}
                        onSelect={(data) => setRange(prev => ({ ...prev, from: data }))}
                  /> }
            </div>
            <div ref={pickersRefs[1]} className="relative w-full space-y-2 flex flex-col" onClick={() => setVisible({ from: false, to: true })}>
                <IconText Icon={CalendarArrowDown} fontSize={15} text="Check-Out" iconClassName="stroke-gray-700" />
                <p className="text-gray-700 m-0">{range?.to ? range?.to.toLocaleDateString('en-US', dateOpts) : "Pick Date"}</p>
                { visible.to && 
                    <Calendar
                        startMonth={range?.from}
                        defaultMonth={range?.to}
                        disabledDates={disabledDates.beforeFrom}
                        selected={range?.to}
                        onSelect={(data) => setRange(prev => ({ ...prev, to: data }))}
                  /> }
            </div>
        </div>
    )
}

export default DatePicker;
