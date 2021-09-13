import React from 'react'

import { CircularProgress } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import classNames from 'classnames'

import { ILoaderProps } from './loader.model'

import styles from './loader.module.css'

const themeOptions = createTheme({
  palette: {
    primary: {
      main: '#8585ad',
      dark: '#2f2f37',
    },
  },
})

const Loader = ({ className, circularProgressProps }: ILoaderProps): JSX.Element => {
  const wrapperClass = classNames(styles.wrapper, className)

  return (
    <div className={wrapperClass}>
      <ThemeProvider theme={themeOptions}>
        <CircularProgress color='primary' {...circularProgressProps} />
      </ThemeProvider>
    </div>
  )
}

export default Loader
