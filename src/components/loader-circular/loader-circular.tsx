import React, { useMemo } from 'react'

import { CircularProgress, CircularProgressProps } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import classNames from 'classnames'

import themeOptions from '../../common/constants/theme.constant'

import styles from './loader-circular.module.css'

interface ILoaderProps {
  className: string
  circularProgressProps: CircularProgressProps
}

const LoaderCircular = ({
  className = '',
  circularProgressProps,
}: Partial<ILoaderProps>): JSX.Element => {
  const wrapperClass = useMemo(() => classNames(styles.wrapper, className), [className])

  return (
    <div className={wrapperClass}>
      <ThemeProvider theme={themeOptions}>
        <CircularProgress color='primary' {...circularProgressProps} />
      </ThemeProvider>
    </div>
  )
}

export default React.memo(LoaderCircular)
