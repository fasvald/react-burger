import React, { useMemo } from 'react'

import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'

import { IAppHeaderProps } from './app-header.model'

import styles from './app-header.module.css'

const AppHeader = ({ className = '' }: IAppHeaderProps): JSX.Element => {
  const BurgerIconMemo = useMemo(() => <BurgerIcon type='primary' />, [])
  const ListIconMemo = useMemo(() => <ListIcon type='primary' />, [])
  const ProfileIconMemo = useMemo(() => <ProfileIcon type='primary' />, [])
  const LogoMemo = useMemo(() => <Logo />, [])
  const headerClass = useMemo(() => classNames(styles.header, className), [className])
  const navLeftClass = useMemo(() => classNames(styles.nav, styles.navLeft), [])
  const navRightClass = useMemo(() => classNames(styles.nav, styles.navRight), [])

  return (
    /**
     * NOTE: The logic is based on this article (version 3) => https://ishadeed.com/article/website-headers-flexbox/
     * Yep there is a chance to push only the last item of nav and make logo as absolute, but I do not think
     * this is a great solution, anyway the logo in center is also kind of cool but at the same time leads to a lot
     * of pitfalls... Also there is a way to do a header with or without inner wrapper.
     *
     * P.S. There are plenty of techniques how to do it.
     */
    <header className={headerClass}>
      <div className={styles.wrapper}>
        <nav className={navLeftClass}>
          <ul className={styles.menu}>
            <li className={styles.menuItem}>
              <NavLink
                exact
                to='/'
                className={styles.menuItemLink}
                activeClassName={styles.menuItemLinkActive}
              >
                {BurgerIconMemo}
                <span className='text text_type_main-default'>Конструктор</span>
              </NavLink>
            </li>
            <li className={styles.menuItem}>
              <NavLink
                exact
                to='/not-yet-implemented'
                className={styles.menuItemLink}
                activeClassName={styles.menuItemLinkActive}
              >
                {ListIconMemo}
                <span className='text text_type_main-default'>Лента заказов</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <NavLink exact to='/' className={styles.logo}>
          {LogoMemo}
        </NavLink>
        <nav className={navRightClass}>
          <ul className={styles.menu}>
            <li className={styles.menuItem}>
              <NavLink
                strict
                to='/profile'
                className={styles.menuItemLink}
                activeClassName={styles.menuItemLinkActive}
              >
                {ProfileIconMemo}
                <span className='text text_type_main-default'>Личный кабинет</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default React.memo(AppHeader)
