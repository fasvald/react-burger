import React, { useMemo } from 'react'

import classNames from 'classnames'

import { IAppContentProps } from './app.content.model'

const AppContent = ({ children, className = '' }: IAppContentProps): JSX.Element => {
  const mainClass = useMemo(() => classNames(className), [className])

  return <main className={mainClass}>{children}</main>
}

export default React.memo(AppContent)
