import React, { useCallback, useMemo } from 'react'

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import classNames from 'classnames'
import Cookies from 'js-cookie'
import { Route, Routes, useNavigate, NavLink, Outlet } from 'react-router-dom'

import themeOptions from '@common/constants/theme.constant'
import { useAppDispatch, useAppSelector } from '@hooks'
import { clearAuthorizedUser, signOut } from '@services/slices/auth.slice'
import { clearUser } from '@services/slices/user.slice'

import { signOutStatusSelector } from './profile-page.slice'

import styles from './profile-page.module.css'

const LinearProgressCustom = styled(LinearProgress)(({ theme }) => ({
  // height: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: themeOptions.palette.primary.dark,
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: themeOptions.palette.primary.main,
  },
}))

const ProfilePage = (): JSX.Element => {
  const signOutStatus = useAppSelector(signOutStatusSelector)

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const handleClick = useCallback(async () => {
    const resultAction = await dispatch(signOut())

    if (signOut.fulfilled.match(resultAction)) {
      Cookies.remove('sb-refreshToken', { path: '/' })
      Cookies.remove('sb-authToken', { path: '/' })

      dispatch(clearUser())
      dispatch(clearAuthorizedUser())

      navigate('/login')
    }
  }, [dispatch, navigate])

  const listItemLinkClass = useMemo(
    () => classNames('text text_type_main-medium text_color_inactive', styles.listItemLink),
    [],
  )

  const listItemLinkBtnClass = useMemo(
    () =>
      classNames(
        'text text_type_main-medium text_color_inactive',
        styles.listItemLink,
        styles.listItemLink_btn,
      ),
    [],
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <NavLink
              to=''
              className={({ isActive }) =>
                [listItemLinkClass, isActive ? styles.listItemLinkActive : undefined]
                  .filter(Boolean)
                  .join(' ')
              }
              end
            >
              Профиль
            </NavLink>
          </li>
          <li className={styles.listItem}>
            <NavLink
              to='orders'
              className={({ isActive }) =>
                [listItemLinkClass, isActive ? styles.listItemLinkActive : undefined]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              История заказов
            </NavLink>
          </li>
          <li className={styles.listItem}>
            {/* NOTE: Either button or https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md#case-i-need-the-html-to-be-interactive-dont-i-need-to-use-an-a-tag-for-that (div with role) */}
            <button type='button' className={listItemLinkBtnClass} onClick={handleClick}>
              <span>Выход</span>
              {signOutStatus === 'loading' && (
                <div className={styles.listItemLinkLoader}>
                  <LinearProgressCustom />
                </div>
              )}
            </button>
          </li>
        </ul>
        <div className={styles.description}>
          <Routes>
            <Route
              path=''
              element={
                <p className='text text_type_main-default text_color_inactive'>
                  В этом разделе вы можете изменить свои персональные данные
                </p>
              }
            />
            <Route
              path='orders/*'
              element={
                <p className='text text_type_main-default text_color_inactive'>
                  В этом разделе вы можете посмотреть свои заказы
                </p>
              }
            />
          </Routes>
        </div>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}

export default React.memo(ProfilePage)
