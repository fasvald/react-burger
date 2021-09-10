import classNames from 'classnames';
import React from 'react';

import { IAppContentProps } from './app.content.model';

function AppContent ({ children, className = '' }: IAppContentProps) {
  return <main className={classNames(className)}>{children}</main>;
}

export default AppContent;
