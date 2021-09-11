import classNames from 'classnames';
import React from 'react';

import { IAppFooterProps } from './app-footer.model';

const AppFooter = ({ children, className = '' }: IAppFooterProps) => (
  <footer className={classNames(className)}>{children}</footer>
);

export default AppFooter;
