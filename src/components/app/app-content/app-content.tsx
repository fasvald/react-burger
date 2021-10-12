import React, { useMemo } from 'react'

import classNames from 'classnames'

interface IAppContentProps {
  children?: React.ReactNode
  className?: string
}

const AppContent = ({ children, className = '' }: IAppContentProps): JSX.Element => {
  const mainClass = useMemo(() => classNames(className), [className])

  return <main className={mainClass}>{children}</main>
}

export default React.memo(AppContent)
