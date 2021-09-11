import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import classNames from 'classnames';
import React from 'react';

import { IAppHeaderProps } from './app-header.model';

import styles from './app-header.module.css';

const AppHeader = ({ className = '' }: IAppHeaderProps) => (
  /**
   * NOTE: The logic is based on this article (version 3) => https://ishadeed.com/article/website-headers-flexbox/
   * Yep there is a chance to push only the last item of nav and make logo as absolute, but I do not think
   * this is a great solution, anyway the logo in center is also kind of cool but at the same time leads to a lot
   * of pitfalls... Also there is a way to do a header with or without inner wrapper.
   *
   * P.S. There are plenty of techniques how to do it.
   */
  <header className={classNames(styles.header, className)}>
    <div className={styles.wrapper}>
      <nav className={classNames(styles.nav, styles.navLeft)}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href='#' className={styles.menuItemLink}>
              <BurgerIcon type='primary'/>
              <span className='text text_type_main-default'>Конструктор</span>
            </a>
          </li>
          <li className={styles.menuItem}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href='#' className={styles.menuItemLink}>
              <ListIcon type='primary'/>
              <span className='text text_type_main-default'>Лента заказов</span>
            </a>
          </li>
        </ul>
      </nav>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href='#' className={styles.logo}>
        <Logo/>
      </a>
      <nav className={classNames(styles.nav, styles.navRight)}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href='#' className={styles.menuItemLink}>
              <ProfileIcon type='primary'/>
              <span className='text text_type_main-default'>Личный кабинет</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

export default AppHeader;
