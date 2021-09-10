import classNames from 'classnames';
import React from 'react';

import { IAppFooterProps } from './app-footer.model';

function AppFooter ({ children, className = '' }: IAppFooterProps) {
  return (
    <footer className={classNames(className)}>{children}</footer>
  )
}

export default AppFooter;
