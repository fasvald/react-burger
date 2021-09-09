import React from 'react';

import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

import headerStyles from './app-header.module.css';

function AppHeader () {
  return (
    /**
     * NOTE: The logic is based on this article (version 3) => https://ishadeed.com/article/website-headers-flexbox/
     * Yep there is a chance to push only the last item of nav and make logo as absolute, but I do not think
     * this is a great solution, anyway the logo in center is also kind of cool but at the same time leads to a lot
     * of pitfalls... Also there is a way to do a header with or without inner wrapper.
     *
     * P.S. There are plenty of techniques how to do it.
     */
    <header className={headerStyles.header}>
      <div className={headerStyles['header-wrapper']}>
        <nav className={`${headerStyles.nav} ${headerStyles['nav-left']}`}>
          <ul className={headerStyles['nav-menu']}>
            <li className={headerStyles['nav-menu-item']}>
              <a href='#' className={headerStyles['nav-menu-item-link']}>
                <BurgerIcon type='primary' />
                <span className='text text_type_main-default'>Конструктор</span>
              </a>
            </li>
            <li className={headerStyles['nav-menu-item']}>
              <a href='#' className={headerStyles['nav-menu-item-link']}>
                <ListIcon type='primary' />
                <span className='text text_type_main-default'>Лента заказов</span>
              </a>
            </li>
          </ul>
        </nav>
        <a href="#" className={headerStyles['header-logo']}>
          <Logo />
        </a>
        <nav className={`${headerStyles.nav} ${headerStyles['nav-right']}`}>
          <ul className={headerStyles['nav-menu']}>
            <li className={headerStyles['nav-menu-item']}>
              <a href='#' className={headerStyles['nav-menu-item-link']}>
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
