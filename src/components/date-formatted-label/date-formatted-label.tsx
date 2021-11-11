import React from 'react'

import 'dayjs/locale/ru'

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.locale('ru')
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)

interface IDateFormattedLabelProps {
  date: string
}

const DateFormattedLabel = ({ date }: IDateFormattedLabelProps): JSX.Element => {
  const relativeDate = dayjs(date).fromNow()
  const dayTime = dayjs(date).format('HH:MM')
  const timezoneAbbreviate = dayjs(date).tz(dayjs.tz.guess()).format('z')

  return (
    <p className='text text_type_main-default text_color_inactive'>
      {relativeDate}, {dayTime} {timezoneAbbreviate}
    </p>
  )
}

export default React.memo(DateFormattedLabel)
