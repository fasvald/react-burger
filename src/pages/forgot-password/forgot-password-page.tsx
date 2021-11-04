import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { Button, EmailInput } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'

import { isInstanceOfAxiosSerializedError } from '../../common/guards/errors.guards'
import { isEmailValid } from '../../common/utils/validators.utils'
import LoaderCircular from '../../components/loader-circular/loader-circular'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { authSelector } from '../../services/slices/auth.slice'

import {
  forgotPasswordStatusSelector,
  sendPasswordRestorationCode,
} from './forgot-password-page.slice'

import styles from './forgot-password-page.module.css'

const ERROR_MESSAGES: Record<string | number, string> = {
  default: 'Возникла ошибка. Повторите, пожалуйста еще раз.',
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const ForgotPasswordPage = (): JSX.Element => {
  const [form, setForm] = useState({ email: '' })
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>(ERROR_MESSAGES.default)

  const auth = useAppSelector(authSelector)
  const passwordForgotStatus = useAppSelector(forgotPasswordStatusSelector)

  const loginFormRef = useRef<HTMLFormElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promiseRef = useRef<any>(null)

  const navigate = useNavigate()
  const location = useLocation()

  const dispatch = useAppDispatch()

  const isFormValid = useCallback(() => {
    return isEmailValid(form.email)
  }, [form.email])

  const handleSnackbarClose = (event?: SyntheticEvent, reason?: string) => {
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

      // Due to not supporting props drilling of UI library I can't use such libraries like react-hook-forms and can't do
      // a proper form validation, so I got an approval to omit it at all, but I will try to check is via JS + RegExp...
      if (!isFormValid()) {
        return
      }

      promiseRef.current = dispatch(sendPasswordRestorationCode(form))

      const resultAction = await promiseRef.current

      if (sendPasswordRestorationCode.rejected.match(resultAction)) {
        if (isInstanceOfAxiosSerializedError(resultAction.payload)) {
          setErrorMessage(ERROR_MESSAGES[resultAction.payload.status || 'default'])
          setOpen(true)
        }

        return
      }

      navigate('/reset-password', {
        state: {
          fromForgotPasswordPage: true,
          from: location.pathname,
        },
      })
    },
    [dispatch, form, navigate, isFormValid, location.pathname],
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
      promiseRef.current && promiseRef.current?.abort()
    }
  }, [])

  const formWrapperClass = useMemo(
    () => classNames('sb-form sb-form_default sb-form_forgot-password', styles.wrapper),
    [],
  )

  const formClass = useMemo(
    () => classNames('sb-form__body', !isFormValid() ? 'isDisabled' : ''),
    [isFormValid],
  )

  if (auth.user) {
    return <Navigate to='/' />
  }

  return (
    <>
      <div className={formWrapperClass}>
        <p className='sb-form__title text text_type_main-medium'>Восстановление пароля</p>
        <form className={formClass} onSubmit={handleFormSubmit} ref={loginFormRef}>
          <div className='sb-form__body-input-el'>
            <EmailInput onChange={handleFormChange} value={form.email} name='email' />
          </div>
          <Button type='primary' size='large'>
            {passwordForgotStatus !== 'loading' && <span>Восстановить</span>}
            {passwordForgotStatus === 'loading' && (
              <LoaderCircular circularProgressProps={{ size: 26, color: 'secondary' }} />
            )}
          </Button>
        </form>
        <div className='sb-form__content'>
          <p className='sb-form__content-link text text_type_main-default'>
            <span className='text_color_inactive'>Вспомнили пароль? </span>
            <Link className='sb-form__link' to='/login'>
              Войти
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

export default React.memo(ForgotPasswordPage)
