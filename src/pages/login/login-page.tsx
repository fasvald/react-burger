import React, { SyntheticEvent, useCallback, useMemo, useState } from 'react'

import {
  Button,
  EmailInput,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import Cookies from 'js-cookie'
import { Link, useHistory } from 'react-router-dom'

import { getBearerToken } from '../../common/utils/auth.utils'
import { isEmailValid, isPasswordValid } from '../../common/utils/validators.utils'
import Loader from '../../components/loader/loader'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { saveAuthorizedUser } from '../../services/slices/auth.slice'

import { signIn, signInStatusSelector } from './login-page.slice'

import styles from './login-page.module.css'

const LoginPage = (): JSX.Element => {
  const [form, setForm] = useState({ email: '', password: '' })
  const signInStatus = useAppSelector(signInStatusSelector)

  const dispatch = useAppDispatch()
  const history = useHistory()

  const handleFormChange = useCallback((e: SyntheticEvent) => {
    setForm((prevState) => ({
      ...prevState,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
    }))
  }, [])

  const handleFormSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault()

      const resultAction = await dispatch(signIn(form))

      if (signIn.rejected.match(resultAction)) {
        return
      }

      dispatch(saveAuthorizedUser(resultAction.payload))

      Cookies.set('sb-authToken', getBearerToken(resultAction.payload.accessToken), {
        expires: new Date(Date.now() + 20 * 60000),
        path: '/',
      })
      Cookies.set('sb-refreshToken', resultAction.payload.refreshToken, { path: '/' })

      history.push('/')
    },
    [dispatch, form, history],
  )

  const formWrapperClass = useMemo(
    () => classNames('sb-form sb-form_default sb-form_login', styles.wrapper),
    [],
  )

  const formClass = useMemo(
    () =>
      classNames(
        'sb-form__body',
        !isPasswordValid(form.password) || !isEmailValid(form.email) ? 'isDisabled' : '',
      ),
    [form],
  )

  return (
    <div className={formWrapperClass}>
      <p className='sb-form__title text text_type_main-medium'>Вход</p>
      <form className={formClass} onSubmit={handleFormSubmit}>
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
  )
}

export default LoginPage
