import React from 'react'

import classNames from 'classnames'

import { IAppContentProps } from './app.content.model'

const AppContent = ({ children, className = '' }: IAppContentProps): JSX.Element => {
  const mainClass = classNames(className)

  return <main className={mainClass}>{children}</main>
}

export default React.memo(AppContent)
