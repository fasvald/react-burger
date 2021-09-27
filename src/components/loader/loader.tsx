import React, { useMemo } from 'react'

import { CircularProgress } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import classNames from 'classnames'

import themeOptions from './loader.constant'
import { ILoaderProps } from './loader.model'

import styles from './loader.module.css'

const Loader = ({ className, circularProgressProps }: ILoaderProps): JSX.Element => {
  const wrapperClass = useMemo(() => classNames(styles.wrapper, className), [className])

  return (
    <div className={wrapperClass}>
      <ThemeProvider theme={themeOptions}>
        <CircularProgress color='primary' {...circularProgressProps} />
      </ThemeProvider>
    </div>
  )
}

export default React.memo(Loader)
