import React from 'react'

import { RouteProps, Route, Redirect } from 'react-router-dom'

import { useAppSelector } from '../../hooks'
import { authSelector } from '../../services/slices/auth.slice'

const ProtectedRoute = ({ children, ...rest }: RouteProps): JSX.Element | null => {
  const auth = useAppSelector(authSelector)

  return (
    <Route
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
