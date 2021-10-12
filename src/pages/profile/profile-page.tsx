import React, { useCallback, useMemo } from 'react'

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import classNames from 'classnames'
import Cookies from 'js-cookie'
import { nanoid } from 'nanoid'
import { Route, Switch, useHistory, useRouteMatch, NavLink } from 'react-router-dom'

import themeOptions from '../../common/constants/theme.constant'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { clearAuthorizedUser, signOut } from '../../services/slices/auth.slice'
import { clearUser } from '../../services/slices/user.slice'
import { RedirectToNotFound } from '../not-found/not-found-page'

import OrderListPage from './order-list/order-list-page'
import { signOutStatusSelector } from './profile-page.slice'
import PersonalInfoPage from './user-details/user-details-page'

import styles from './profile-page.module.css'

const getRoutes = (path: string, url: string) => [
  {
    id: nanoid(),
    path: `${path}`,
    url: `${url}`,
    exact: true,
    main: () => <PersonalInfoPage />,
    sidebar: {
      title: 'Профиль',
      description: 'В этом разделе вы можете изменить свои персональные данные',
    },
  },
  {
    id: nanoid(),
    path: `${path}/orders`,
    url: `${url}/orders`,
    sidebar: {
      title: 'История заказов',
      description: 'В этом разделе вы можете посмотреть свои заказы',
    },
    main: () => <OrderListPage />,
  },
]

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

  // The `path` lets us build <Route> paths that are
  // relative to the parent route, while the `url` lets
  // us build relative links.
  const { path, url } = useRouteMatch()
  const history = useHistory()

  const dispatch = useAppDispatch()

  const routes = useMemo(() => getRoutes(path, url), [path, url])

  const handleClick = useCallback(async () => {
    const resultAction = await dispatch(signOut())

    if (signOut.fulfilled.match(resultAction)) {
      Cookies.remove('sb-refreshToken', { path: '/' })
      Cookies.remove('sb-authToken', { path: '/' })

      dispatch(clearUser())
      dispatch(clearAuthorizedUser())

      history.push('/login')
    }
  }, [dispatch, history])

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
          {routes.map((route) => (
            <li className={styles.listItem} key={route.id}>
              <NavLink
                className={listItemLinkClass}
                exact
                to={route.url}
                activeClassName={styles.listItemLinkActive}
              >
                {route.sidebar.title}
              </NavLink>
            </li>
          ))}
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
          <Switch>
            {routes.map((route) => (
              <Route key={route.id} path={route.path} exact={route.exact}>
                <p className='text text_type_main-default text_color_inactive'>
                  {route.sidebar.description || ''}
                </p>
              </Route>
            ))}
          </Switch>
        </div>
      </div>
      <div className={styles.content}>
        <Switch>
          {routes.map((route, index) => (
            // You can render a <Route> in as many places
            // as you want in your app. It will render along
            // with any other <Route>s that also match the URL.
            // So, a sidebar or breadcrumbs or anything else
            // that requires you to render multiple things
            // in multiple places at the same URL is nothing
            // more than multiple <Route>s.
            <Route key={route.id} path={route.path} exact={route?.exact}>
              <route.main />
            </Route>
          ))}
          <Route path='*'>
            <RedirectToNotFound />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default React.memo(ProfilePage)
