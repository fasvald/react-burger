import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom'

import { isInstanceOfAxiosSerializedError } from '../../common/guards/errors.guards'
import { isPasswordValid, isTokenPasswordChangeValid } from '../../common/utils/validators.utils'
import Loader from '../../components/loader-circular/loader-circular'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { authSelector } from '../../services/slices/auth.slice'

import { resetPasswordStatusSelector, resetPassword } from './reset-password-page.slice'

import styles from './reset-password-page.module.css'

const ERROR_MESSAGES: Record<string | number, string> = {
  default: 'Возникла ошибка. Повторите, пожалуйста еще раз.',
  404: 'Не удаётся войти. Пожалуйста, проверьте правильность написания кода из письма.',
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const ResetPasswordPage = (): JSX.Element => {
  const [form, setForm] = useState({ password: '', token: '' })
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>(ERROR_MESSAGES.default)

  const auth = useAppSelector(authSelector)
  const resetPasswordStatus = useAppSelector(resetPasswordStatusSelector)

  const loginFormRef = useRef<HTMLFormElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promiseRef = useRef<any>(null)

  const history = useHistory()
  const { state } = useLocation<{ fromForgotPasswordPage?: boolean; from: string }>()

  const dispatch = useAppDispatch()

  const isFormValid = useCallback(() => {
    return isPasswordValid(form.password) && isTokenPasswordChangeValid(form.token)
  }, [form.password, form.token])

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

      // Can't set disable state for a button, so we just check it here to prevent sending a request
      if (!isFormValid()) {
        return
      }

      promiseRef.current = dispatch(resetPassword(form))

      const resultAction = await promiseRef.current

      // Based on https://redux-toolkit.js.org/usage/usage-with-typescript#createasyncthunk
      if (resetPassword.rejected.match(resultAction)) {
        if (isInstanceOfAxiosSerializedError(resultAction.payload)) {
          setErrorMessage(ERROR_MESSAGES[resultAction.payload.status || 'default'])
          setOpen(true)
        }

        return
      }

      history.push('/login')
    },
    [dispatch, form, history, isFormValid],
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
    () => classNames('sb-form sb-form_default sb-form_reset-password', styles.wrapper),
    [],
  )

  const formClass = useMemo(
    () => classNames('sb-form__body', !isFormValid() ? 'isDisabled' : ''),
    [isFormValid],
  )

  if (auth.user || !state?.fromForgotPasswordPage) {
    return <Redirect to={state?.from || ''} />
  }

  return (
    <>
      <div className={formWrapperClass}>
        <p className='sb-form__title text text_type_main-medium'>Восстановление пароля</p>
        <form className={formClass} onSubmit={handleFormSubmit} ref={loginFormRef}>
          <div className='sb-form__body-input-el'>
            <PasswordInput onChange={handleFormChange} value={form.password} name='password' />
          </div>
          <div className='sb-form__body-input-el'>
            <Input
              type='text'
              placeholder='Введите код из письма'
              onChange={handleFormChange}
              value={form.token}
              name='token'
              size='default'
            />
          </div>
          <Button type='primary' size='large'>
            {resetPasswordStatus !== 'loading' && <span>Сохранить</span>}
            {resetPasswordStatus === 'loading' && (
              <Loader circularProgressProps={{ size: 26, color: 'secondary' }} />
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

export default React.memo(ResetPasswordPage)
