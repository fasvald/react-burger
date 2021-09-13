import React from 'react'

import classNames from 'classnames'

import { IAppFooterProps } from './app-footer.model'

const AppFooter = ({ children, className = '' }: IAppFooterProps): JSX.Element => (
  <footer className={classNames(className)}>{children}</footer>
)

export default AppFooter
