import React, { SyntheticEvent, useCallback, useMemo, useState } from 'react'

import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import Cookies from 'js-cookie'
import { Link, useHistory } from 'react-router-dom'

import { authSelector, signUp } from '../../common/services/slices/auth/auth.slice'
import getBearerToken from '../../common/services/slices/auth/auth.utils'
import { useAppDispatch, useAppSelector } from '../../hooks'

import styles from './register-page.module.css'

const RegisterPage = (): JSX.Element => {
  const history = useHistory()

  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const auth = useAppSelector(authSelector)

  const dispatch = useAppDispatch()

  const handleFormChange = useCallback((e: SyntheticEvent) => {
    setForm((prevState) => ({
      ...prevState,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
    }))
  }, [])

  const handleFormSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault()

      dispatch(signUp(form)).then(() => {
        if (auth) {
          Cookies.set('sb-authToken', getBearerToken(auth.accessToken))
          Cookies.set('sb-refreshToken', auth.refreshToken)
        }

        history.push('/')
      })
    },
    [dispatch, form, history, auth],
  )

  const formClass = useMemo(() => classNames('sb-form sb-form_default', styles.wrapper), [])

  return (
    <div className={formClass}>
      <p className='sb-form__title text text_type_main-medium'>Регистрация</p>
      <form className='sb-form__body' onSubmit={handleFormSubmit}>
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
          Зарегистрироваться
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
  )
}

export default RegisterPage
