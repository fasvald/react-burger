import classNames from 'classnames';
import React from 'react';

import { IAppContentProps } from './app.content.model';

const AppContent = ({ children, className = '' }: IAppContentProps) => (
  <main className={classNames(className)}>{children}</main>
);

export default AppContent;