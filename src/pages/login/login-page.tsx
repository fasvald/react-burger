import React, { SyntheticEvent, useCallback, useMemo, useState } from 'react'

import {
  Button,
  EmailInput,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import styles from './login-page.module.css'

const LoginPage = (): JSX.Element => {
  const [form, setForm] = useState({ email: '', password: '' })

  const handleFormChange = useCallback((e: SyntheticEvent) => {
    setForm((prevState) => ({
      ...prevState,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
    }))
  }, [])

  const handleFormSubmit = useCallback((e: SyntheticEvent) => {
    e.preventDefault()
  }, [])

  const formClass = useMemo(() => classNames('sb-form sb-form_default', styles.wrapper), [])

  return (
    <div className={formClass}>
      <p className='sb-form__title text text_type_main-medium'>Вход</p>
      <form className='sb-form__body' onSubmit={handleFormSubmit}>
        <div className='sb-form__body-input-el'>
          <EmailInput onChange={handleFormChange} value={form.email} name='email' />
        </div>
        <div className='sb-form__body-input-el'>
          <PasswordInput onChange={handleFormChange} value={form.password} name='password' />
        </div>
        <Button type='primary' size='large'>
          Войти
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
