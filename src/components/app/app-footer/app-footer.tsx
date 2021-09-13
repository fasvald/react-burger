import React from 'react'

import classNames from 'classnames'

import { IAppFooterProps } from './app-footer.model'

const AppFooter = ({ children, className = '' }: IAppFooterProps): JSX.Element => {
  const footerClass = classNames(className)

  return <footer className={footerClass}>{children}</footer>
}

export default AppFooter
