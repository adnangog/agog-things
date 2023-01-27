import { useState, useEffect, useRef } from 'react'
import { useOutsideChecker } from '../../helpers/hooks'
import TextBox, { TextBoxProps } from '../textbox'
import '../styles/datepicker.css'
export default function DatePicker({
  lang = window.navigator.language,
  format = 'DD.MM.YYYY',
  value,
  label,
  placeholder = '',
  onChange: OnChange,
  infoText,
  style,
}: DatePickerProps): JSX.Element {
  const [calendar, setCalendar] = useState<any>()
  const [date, setDate] = useState<any>()
  const [show, setShow] = useState<boolean>(false)
  const wrapperRef = useRef(null)
  useOutsideChecker(wrapperRef, ' datepicker-active', () => setShow(false))

  useEffect(() => {
    const date = value ? Day(new Date(value)) : Day(new Date())
    setCalendar(Calendar(date.year, date.monthNumber))
  }, [])

  const Calendar = function (year: number, monthNumber: number): ICalendar {
    const today = Day(new Date())
    const year_ = year || today.year
    const month = Month(new Date(year_, (monthNumber || today.monthNumber) - 1), 0)

    const calendar: ICalendar = {
      today,
      weekDays: Array.from({ length: 5 }, (_) => ''),
      year: year_,
      month,
    }

    for (let i = 0; i < calendar.weekDays.length; i++) {
      const day = Month(new Date(year_, today.monthNumber - 1), i + 1).getDay
      if (!(calendar.weekDays.indexOf(day.day) > -1)) {
        calendar.weekDays[day.dayNumber - 1] = day.day
      }
    }

    return calendar
  }

  const Month = function (date: Date, dayNumber: number): IMonth {
    const monthsSize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const day = Day(date)

    const month: IMonth = {
      day: day,
      monthsSize: monthsSize,
      name: day.month,
      number: day.monthNumber,
      year: day.year,
      numberOfDays:
        day.monthNumber === 2
          ? monthsSize[day.monthNumber - 1] + (isLeapYear(day.year) ? 1 : 0)
          : monthsSize[day.monthNumber - 1],
      getDay: Day(new Date(day.year, day.monthNumber - 1, dayNumber)),
    }

    return month
  }

  const Day = function (date: Date): IDay {
    const day: IDay = {
      Date: date,
      date: date.getDate(),
      day: date.toLocaleString(lang, { weekday: 'long' }),
      dayNumber: date.getDay() || 7,
      dayShort: date.toLocaleString(lang, { weekday: 'short' }),
      year: date.getFullYear(),
      yearShort: date.toLocaleString(lang, { year: '2-digit' }),
      month: date.toLocaleString(lang, { month: 'long' }),
      monthShort: date.toLocaleString(lang, { month: 'short' }),
      monthNumber: date.getMonth() + 1,
      timestamp: date.getTime(),
      week: getWeekNumber(date),
    }

    return day
  }

  const nextMonth = function () {
    if (calendar.month.number === 12) {
      return nextYear()
    }

    setCalendar((prevCalendar: ICalendar) => ({
      ...calendar,
      month: Month(new Date(prevCalendar.year, prevCalendar.month.number + 1 - 1), 0),
    }))
  }

  const prevMonth = function () {
    if (calendar.month.number === 1) {
      return prevYear()
    }

    setCalendar((prevCalendar: ICalendar) => ({
      ...calendar,
      month: Month(new Date(prevCalendar.year, prevCalendar.month.number - 1 - 1), 0),
    }))
  }

  const nextYear = function () {
    setCalendar((prevCalendar: ICalendar) => ({
      ...calendar,
      year: prevCalendar.year + 1,
      month: Month(new Date(prevCalendar.year, 0), 0),
    }))
  }

  const prevYear = function () {
    setCalendar((prevCalendar: ICalendar) => ({
      ...calendar,
      year: prevCalendar.year - 1,
      month: Month(new Date(prevCalendar.year, 11), 0),
    }))
  }

  const getPreviousMonth = function () {
    if (calendar.month.number === 1) {
      return Month(new Date(calendar.year - 1, 11), 0)
    }
    return Month(new Date(calendar.year, calendar.month.number - 2), 0)
  }

  // const getNextMonth = function () {
  //     if (calendar.month.number === 12) {
  //         return Month(new Date(calendar.year + 1, 0), 0);
  //     }
  //     return Month(new Date(calendar.year, calendar.month.number + 2), 0);
  // }

  // const getMonth = function (monthNumber: number) {
  //     return Month(new Date(calendar.year, monthNumber - 1), 0);
  // }

  // const goToDate = function (monthNumber: number, year: number) {
  //     setCalendar({ ...calendar, year, month: Month(new Date(year, monthNumber - 1), 0) })
  // }

  const getWeekNumber = function (date: Date) {
    const firstDayOfTheYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfTheYear.getTime()) / 86400000

    return Math.ceil((pastDaysOfYear + firstDayOfTheYear.getDay() + 1) / 7)
  }

  const isLeapYear = function (year: number) {
    return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0
  }

  const getWeekDaysElementStrings = function () {
    return calendar.weekDays.map((weekDay: any, index: number) => (
      <span key={`span${index}`}>{weekDay.substring(0, 3)}</span>
    ))
  }

  const getMonthDaysGrid = function () {
    const firstDayOfTheMonth = getDay(calendar.month, 1)
    const prevMonth = getPreviousMonth()
    const totalLastMonthFinalDays = firstDayOfTheMonth.dayNumber - 1
    const totalDays = calendar.month.numberOfDays + totalLastMonthFinalDays
    const monthList = []

    for (let index = 0; index < totalDays.length; index++) {
      monthList.push(undefined)
    }

    for (let i = totalLastMonthFinalDays; i < totalDays; i++) {
      monthList[i] = getDay(calendar.month, i + 1 - totalLastMonthFinalDays)
    }

    for (let i = 0; i < totalLastMonthFinalDays; i++) {
      const inverted = totalLastMonthFinalDays - (i + 1)
      monthList[i] = getDay(prevMonth, prevMonth.numberOfDays - inverted)
    }

    return monthList
  }

  const getDay = (month: IMonth, dayNumber: number) => {
    return Day(new Date(month.year, month.number - 1, dayNumber))
  }

  const dayFormat = (day: IDay, formatStr: string) => {
    if (!String.prototype.padStart) {
      String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0 //truncate if number or convert non-number to 0;
        padString = String(typeof padString !== 'undefined' ? padString : ' ')
        if (this.length > targetLength) {
          return String(this)
        } else {
          targetLength = targetLength - this.length
          if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length) //append to original to ensure we are longer than needed
          }
          return padString.slice(0, targetLength) + String(this)
        }
      }
    }

    return formatStr
      .replace(/\bYYYY\b/, day.year.toString())
      .replace(/\bYYY\b/, day.yearShort)
      .replace(/\bWW\b/, day.week.toString().padStart(2, '0'))
      .replace(/\bW\b/, day.week.toString())
      .replace(/\bDDDD\b/, day.day)
      .replace(/\bDDD\b/, day.dayShort)
      .replace(/\bDD\b/, day.date.toString().padStart(2, '0'))
      .replace(/\bD\b/, day.date.toString())
      .replace(/\bMMMM\b/, day.month)
      .replace(/\bMMM\b/, day.monthShort)
      .replace(/\bMM\b/, day.monthNumber.toString().padStart(2, '0'))
      .replace(/\bM\b/, day.monthNumber.toString())
  }

  const isEqualTo = (date: any, day: IDay) => {
    date = date?.Date || date

    return date?.getDate() === day.date && date?.getMonth() === day.monthNumber - 1 && date?.getFullYear() === day.year
  }

  // const stringToDate = (str: string, format: string) => {
  //     switch (format) {
  //         case "DD.MM.YYYY":
  //             return new Date(str.replace(/(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"))
  //         default:
  //             return new Date(str)
  //     }
  // }

  const selectDay = (day: IDay) => {
    if (isEqualTo(date, day)) return
    setDate(day)
    OnChange(dayFormat(day, format))

    if (day.monthNumber !== calendar.month.number) {
      prevMonth()
    }

    setShow(false)
  }

  const render = () => {
    const monthYear = calendar.month.name + ', ' + calendar.year

    return (
      <div className='date-picker'>
        <div className='calendar-dropdown'>
          <div className='header'>
            <div>
              <button type='button' className='prev-year' aria-label='previous year' onClick={prevYear}>
                <span className='icon-cont  super-prev'>
                  <span className='super-prev-icon'></span>
                </span>
              </button>
            </div>
            <div>
              <button type='button' className='prev-month' aria-label='previous month' onClick={prevMonth}>
                <span className='icon-cont'>
                  <span className='prev-icon'></span>
                </span>
              </button>
            </div>
            <p tabIndex={0} aria-label={`current month ${monthYear}`}>
              {monthYear}
            </p>
            <div>
              <button type='button' className='prev-month' aria-label='next month' onClick={nextMonth}>
                <span className='icon-cont'>
                  <span className='next-icon'></span>
                </span>
              </button>
            </div>
            <div>
              <button type='button' className='next-year' aria-label='next year' onClick={nextYear}>
                <span className='icon-cont super-next'>
                  <span className='super-next-icon'></span>
                </span>
              </button>
            </div>
          </div>
          <div className='week-days'>{getWeekDaysElementStrings()}</div>
          <div className='month-days'>
            {getMonthDaysGrid().map((day: any, dayIndex) => {
              const itemClass = ['month-day']
              if (day.monthNumber === calendar.month.number) itemClass.push('current')
              if (day.timestamp === date?.timestamp) itemClass.push('selected')
              return (
                <button
                  key={`day${dayIndex}`}
                  className={itemClass.join(' ')}
                  onClick={() => {
                    selectDay(day)
                  }}
                >
                  {day?.date}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const txtDatePicker: TextBoxProps = {
    label,
    value: date && dayFormat(date, 'DD.MM.YYYY'),
    placeholder,
    infoText,
    onFocus: () => setShow(true),
  }

  return (
    <div className={show ? `agog-datepicker datepicker-active` : `agog-datepicker`} style={style} ref={wrapperRef}>
      <TextBox {...txtDatePicker} />
      {calendar && render()}
    </div>
  )
}

export interface DatePickerProps {
  lang: string
  format: string
  callbackBefore?: void
  callbackAfter?: void
  onChange(str: string): void
  value?: string
  label?: string
  placeholder?: string
  infoText?: string
  style?: React.CSSProperties
}

interface IDay {
  Date: Date
  date: number
  day: string
  dayNumber: number
  dayShort: string
  year: number
  yearShort: string
  month: string
  monthShort: string
  monthNumber: number
  timestamp: number
  week: number
}

interface IMonth {
  day: IDay
  monthsSize: number[]
  name: string
  number: number
  year: number
  numberOfDays: number
  getDay: IDay
}

interface ICalendar {
  today: IDay
  weekDays: any
  year: number
  month: IMonth
}
