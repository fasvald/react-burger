import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { Link, Redirect, useHistory } from 'react-router-dom'

import { isInstanceOfAxiosSerializedError } from '../../common/guards/errors.guards'
import { isEmailValid, isNameValid, isPasswordValid } from '../../common/utils/validators.utils'
import Loader from '../../components/loader-circular/loader-circular'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { authSelector, signUp } from '../../services/slices/auth.slice'

import { signUpStatusSelector } from './register-page.slice'

import styles from './register-page.module.css'

const ERROR_MESSAGES: Record<string | number, string> = {
  default: 'Возникла ошибка. Повторите, пожалуйста еще раз.',
  403: 'Не удаётся зарегистрироваться. Такой пользователь уже существует.',
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const RegisterPage = (): JSX.Element => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>(ERROR_MESSAGES.default)

  const auth = useAppSelector(authSelector)
  const signUpStatus = useAppSelector(signUpStatusSelector)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promiseRef = useRef<any>(null)
  const loginFormRef = useRef<HTMLFormElement>(null)

  const history = useHistory()

  const dispatch = useAppDispatch()

  const isFormValid = useCallback(() => {
    return isEmailValid(form.email) && isPasswordValid(form.password) && isNameValid(form.name)
  }, [form.email, form.password, form.name])

  const handleFormChange = useCallback((e: SyntheticEvent) => {
    setForm((prevState) => ({
      ...prevState,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
    }))
  }, [])

  const handleSnackbarClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const handleFormSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault()

      // Can't set disable state for a button, so we just check it here to prevent sending a request
      if (!isFormValid()) {
        return
      }

      promiseRef.current = dispatch(signUp(form))

      const resultAction = await promiseRef.current

      if (signUp.rejected.match(resultAction)) {
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
    () => classNames('sb-form sb-form_default sb-form_register', styles.wrapper),
    [],
  )

  const formClass = useMemo(
    () => classNames('sb-form__body', !isFormValid() ? 'isDisabled' : ''),
    [isFormValid],
  )

  if (auth.user) {
    return <Redirect to='/' />
  }

  return (
    <>
      <div className={formWrapperClass}>
        <p className='sb-form__title text text_type_main-medium'>Регистрация</p>
        <form className={formClass} onSubmit={handleFormSubmit} ref={loginFormRef}>
          <div className='sb-form__body-input-el'>
            <Input
              type='text'
              placeholder='Имя'
              onChange={handleFormChange}
              value={form.name}
              name='name'
              size='default'
            />
          </div>
          <div className='sb-form__body-input-el'>
            <EmailInput onChange={handleFormChange} value={form.email} name='email' />
          </div>
          <div className='sb-form__body-input-el'>
            <PasswordInput onChange={handleFormChange} value={form.password} name='password' />
          </div>
          <Button type='primary' size='large'>
            {signUpStatus !== 'loading' && <span>Зарегистрироваться</span>}
            {signUpStatus === 'loading' && (
              <Loader circularProgressProps={{ size: 26, color: 'secondary' }} />
            )}
          </Button>
        </form>
        <div className='sb-form__content'>
          <p className='sb-form__content-link text text_type_main-default'>
            <span className='text_color_inactive'>Уже зарегистрированы? </span>
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

export default React.memo(RegisterPage)
