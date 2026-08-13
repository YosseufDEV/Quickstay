import { Calendar as C } from '@/Components/ui/calendar';
import { CalendarArrowDown, CalendarArrowUp, MapPinned, Search, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import IconText from '../IconText/IconText';
import SpringyButton from '../SpringyButton/SpringyButton';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { SelectBoxMenu } from '../SelectBox/SelectBox';
import { useQuery } from '@tanstack/react-query';
import { getHotelsCities } from '@/api/hotel';

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

const SelectBoxItem = ({ searchable=false, Icon, text, items, placeholder, value, setValue }) => {
    const masterRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={masterRef} className="relative cursor-pointer">
            <SelectBoxMenu 
                onSelect={(item) => { setValue(item); }}
                masterRef={masterRef}
                searchable={searchable} 
                items={items} 
            />
            <div className="cursor-pointer relative w-fit nowrap space-y-2 flex flex-col">
                <IconText Icon={Icon} fontSize={15} text={text} iconClassName="stroke-gray-700" />
                <p className="text-gray-700 m-0">{value ?? placeholder}</p>
            </div>
        </div>
    )
}


const CalendarItem = ({ 
                        text, 
                        Icon, 
                        selected, 
                        onSelect, 
                        disabledDates, 
                        startMonth, 
                        endMonth, 
                        defaultMonth }: CalendarProps & { text: string, Icon: React.ElementType }) => {
    const dateOpts = { year: 'numeric', month: 'short', day: 'numeric' } as const;

    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState<boolean>(false);

    useOutsideClick(ref, () => setVisible(false));

    return <div ref={ref} className="cursor-pointer relative flex w-fit space-y-2 flex-col" onClick={() => setVisible(true)}>
            <IconText Icon={Icon} fontSize={15} text={text} iconClassName="stroke-gray-700" />

            <p className="text-gray-700 m-0">{selected ? selected.toLocaleDateString('en-US', dateOpts) : "Pick Date"}</p>

            { visible && 
                <C
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
        </div>
}


type DatePickerProps = { 
    className?: string,
    range: { from: Date, to: Date }, 
    ref?: any, 
    setRange: (_: any) => void

    destination?: never 
    setDestination?: never
    withDestination?: never
    searchCallback?: never
} | {
    className?: string,
    range: { from: Date, to: Date }, 
    ref?: any, 
    setRange: (_: any) => void

    destination: string
    withDestination: true
    setDestination: (newVal: string) => void
    searchCallback: () => void
}

// FIX: Size is not static and changes when the value of the select box changes, need to fix that
const BookingSearchBar = ({ className="", ref, range, setRange, withDestination, destination, setDestination, searchCallback }: DatePickerProps) => {
    const [guests, setGuests] = useState<number>(1);

    const { data: cities = [] } = useQuery({
        queryKey: ['cities'],
        queryFn: async () => {
            const response = await getHotelsCities();

            return response;
        }
    });

    const disabledDates = {
        beforeFrom: range?.from ? getDaysUntilMonthEnd('before', range.from) : [],
        afterTo: range?.to ? getDaysUntilMonthEnd('after', range.to) : []
    }

    return (
        <div ref={ref} className={ `${className} w-full bg-white text-nowrap px-20 py-7 font-[Outfit] inset-shadow-sm shadow-md rounded-xl flex justify-around items-center` }>
            { withDestination &&
                <SelectBoxItem 
                    searchable={true}
                    items={cities.map((city: string) => ({ label: city, value: city }))}
                    Icon={MapPinned} 
                    text="Destination"
                    value={destination}
                    placeholder="Select Destination"
                    setValue={setDestination} 
                />
            }

            <CalendarItem   
                        text="Check-in"
                        Icon={CalendarArrowDown}
                        endMonth={range?.to}
                        defaultMonth={range?.from ? range.from : new Date()}
                        // FIXME: It doesn't disable the last 3 days of the past month show in calendar, need to fix that
                        disabledDates={disabledDates.afterTo.concat(getDaysUntilMonthEnd('before', new Date()))}
                        selected={range?.from}
                        onSelect={(data) => setRange((prev: any) => ({ ...prev, from: data }))}
            />

            <CalendarItem   
                        text="Check-out"
                        Icon={CalendarArrowUp}
                        startMonth={range?.from}
                        defaultMonth={range?.to ? range.to : new Date()}
                        disabledDates={disabledDates.beforeFrom}
                        selected={range?.to}
                        onSelect={(data) => setRange((prev: any) => ({ ...prev, to: data }))}
            />

            <SelectBoxItem items={[{
                        label: "1 Guest", value: "1"
                    }, {
                        label: "2 Guests", value: "2"
                    }, {
                        label: "3 Guests", value: "3"
                    }, {
                        label: "4 Guests", value: "4"
                    }]
            }
                Icon={Users} 
                text="Guests" 
                value={guests}
                placeholder={guests} 
                setValue={setGuests} />

            { withDestination &&
                <SpringyButton onClick={searchCallback} className="w-60 h-15 flex items-center justify-center">
                    <IconText Icon={Search} fontSize={18} text="Search" textClassName="text-white font-medium" iconClassName="stroke-white" />
                </SpringyButton>
            }

        </div>
    )
}

export default BookingSearchBar;
