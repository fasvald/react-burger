import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import {
  Button,
  EmailInput,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import Cookies from 'js-cookie'
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom'

import { TSignInResponse } from '../../common/models/auth.model'
import { getBearerToken, getTokenExpirationDate } from '../../common/utils/auth.utils'
import { instanceOfAxiosSerializedError } from '../../common/utils/errors.utils'
import { isEmailValid, isPasswordValid } from '../../common/utils/validators.utils'
import Loader from '../../components/loader/loader'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { authSelector, saveAuthorizedUser } from '../../services/slices/auth.slice'

import { signIn, signInStatusSelector } from './login-page.slice'

import styles from './login-page.module.css'

const ERROR_MESSAGES: Record<string | number, string> = {
  default: 'Возникла ошибка. Повторите, пожалуйста еще раз.',
  401: 'Не удаётся войти. Пожалуйста, проверьте правильность написания логина и пароля.',
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const LoginPage = (): JSX.Element => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>(ERROR_MESSAGES.default)

  const auth = useAppSelector(authSelector)
  const signInStatus = useAppSelector(signInStatusSelector)

  const loginFormRef = useRef<HTMLFormElement>(null)
  // It's impossible to get the proper type from it or at least I don't know how :( Mb you can help me
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promiseRef = useRef<any>(null)

  const dispatch = useAppDispatch()
  const history = useHistory()
  const { state } = useLocation<{ from: string }>()

  const isFormValid = useCallback(() => {
    return isPasswordValid(form.password) && isEmailValid(form.email)
  }, [form.password, form.email])

  const handleSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const handleFormChange = useCallback((e: SyntheticEvent) => {
    setForm((prevState) => ({
      ...prevState,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
    }))
  }, [])

  const handleFormSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault()

      // Can't set disable state for a button, so we just check it here to prevent sending a request
      if (!isFormValid()) {
        return
      }

      promiseRef.current = dispatch(signIn(form))

      const resultAction = await promiseRef.current

      if (signIn.rejected.match(resultAction)) {
        if (instanceOfAxiosSerializedError(resultAction.payload)) {
          setErrorMessage(ERROR_MESSAGES[resultAction.payload.status || 'default'])
          setOpen(true)
        }

        return
      }

      const { payload } = resultAction as { payload: TSignInResponse }

      Cookies.set('sb-authToken', getBearerToken(payload.accessToken), {
        expires: getTokenExpirationDate(),
        path: '/',
      })

      Cookies.set('sb-refreshToken', payload.refreshToken, { path: '/' })

      dispatch(saveAuthorizedUser(payload.user))

      history.push(state?.from || '/')
    },
    [dispatch, form, history, isFormValid, state],
  )

  useEffect(() => {
    // I don't want to add another wrappers, etc. but it's time consuming to do it properly
    // so we are doing "pro gamer moves" to set a proper type for buttons. Because unlucky for us the
    // provided UI is terrible in case of accessibility and default props drilling. We even can't set a type for a button,
    // so for other forms where it was one button it will work like a form submit thing.
    const loginBtn = loginFormRef.current?.querySelector('button')

    if (loginBtn) {
      loginBtn.setAttribute('type', 'submit')
    }

    return () => {
      promiseRef.current?.abort()
    }
  }, [])

  const formWrapperClass = useMemo(
    () => classNames('sb-form sb-form_default sb-form_login', styles.wrapper),
    [],
  )

  const formClass = useMemo(
    () => classNames('sb-form__body', !isFormValid() ? 'isDisabled' : ''),
    [isFormValid],
  )

  if (auth.user) {
    return <Redirect to={state?.from || '/'} />
  }

  return (
    <>
      <div className={formWrapperClass}>
        <p className='sb-form__title text text_type_main-medium'>Вход</p>
        <form className={formClass} onSubmit={handleFormSubmit} ref={loginFormRef}>
          <div className='sb-form__body-input-el'>
            <EmailInput onChange={handleFormChange} value={form.email} name='email' />
          </div>
          <div className='sb-form__body-input-el'>
            <PasswordInput onChange={handleFormChange} value={form.password} name='password' />
          </div>
          <Button type='primary' size='large'>
            {signInStatus !== 'loading' && <span>Войти</span>}
            {signInStatus === 'loading' && (
              <Loader circularProgressProps={{ size: 26, color: 'secondary' }} />
            )}
          </Button>
        </form>
        <div className='sb-form__content'>
          <p className='sb-form__content-link text text_type_main-default'>
            <span className='text_color_inactive'>Вы — новый пользователь? </span>
            <Link className='sb-form__link' to='/register'>
              Зарегистрироваться
            </Link>
          </p>
          <p className='sb-form__content-link text text_type_main-default'>
            <span className='text_color_inactive'>Забыли пароль? </span>
            <Link className='sb-form__link' to='/forgot-password'>
              Восстановить пароль
            </Link>
          </p>
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity='error' sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default React.memo(LoginPage)
