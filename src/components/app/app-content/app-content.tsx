import React from 'react'

import classNames from 'classnames'

import { IAppContentProps } from './app.content.model'

const AppContent = ({ children, className = '' }: IAppContentProps): JSX.Element => (
  <main className={classNames(className)}>{children}</main>
)

export default AppContent
