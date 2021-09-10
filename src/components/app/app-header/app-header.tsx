import React from 'react';
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import classNames from 'classnames';

import { IAppHeaderProps } from './app-header.model';

import styles from './app-header.module.css';

function AppHeader ({ className = '' }: IAppHeaderProps) {
  return (
    /**
     * NOTE: The logic is based on this article (version 3) => https://ishadeed.com/article/website-headers-flexbox/
     * Yep there is a chance to push only the last item of nav and make logo as absolute, but I do not think
     * this is a great solution, anyway the logo in center is also kind of cool but at the same time leads to a lot
     * of pitfalls... Also there is a way to do a header with or without inner wrapper.
     *
     * P.S. There are plenty of techniques how to do it.
     */
    // <header className={`${headerStyles.header} ${className}`}>
    <header className={classNames(styles.header, className)}>
      <div className={styles['header-wrapper']}>
        <nav className={`${styles.nav} ${styles['nav-left']}`}>
          <ul className={styles['nav-menu']}>
            <li className={styles['nav-menu-item']}>
              <a href='#' className={styles['nav-menu-item-link']}>
                <BurgerIcon type='primary' />
                <span className='text text_type_main-default'>Конструктор</span>
              </a>
            </li>
            <li className={styles['nav-menu-item']}>
              <a href='#' className={styles['nav-menu-item-link']}>
                <ListIcon type='primary' />
                <span className='text text_type_main-default'>Лента заказов</span>
              </a>
            </li>
          </ul>
        </nav>
        <a href='#' className={styles['header-logo']}>
          <Logo />
        </a>
        <nav className={`${styles.nav} ${styles['nav-right']}`}>
          <ul className={styles['nav-menu']}>
            <li className={styles['nav-menu-item']}>
              <a href='#' className={styles['nav-menu-item-link']}>
                <ProfileIcon type='primary' />
                <span className='text text_type_main-default'>Личный кабинет</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
