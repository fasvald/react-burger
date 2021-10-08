import React from 'react'

import { RouteProps, Route, Redirect } from 'react-router'

import { useAppSelector } from '../../hooks'
import { authSelector } from '../../services/slices/auth.slice'

const ProtectedRoute = ({ children, ...rest }: RouteProps): JSX.Element | null => {
  const auth = useAppSelector(authSelector)

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

export default ProtectedRoute
