import React, { SyntheticEvent, useCallback, useMemo, useState } from 'react'

import { Button, Input } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { Link, useHistory } from 'react-router-dom'

import styles from './forgot-password-page.module.css'

const ForgotPasswordPage = (): JSX.Element => {
  const history = useHistory()
  const [form, setForm] = useState({ email: '' })

  const handleFormChange = useCallback((e: SyntheticEvent) => {
    setForm((prevState) => ({
      ...prevState,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
    }))
  }, [])

  const handleFormSubmit = useCallback((e: SyntheticEvent) => {
    e.preventDefault()
  }, [])

  const handleClick = useCallback(() => {
    history.push('/reset-password')
  }, [history])

  const formClass = useMemo(() => classNames('sb-form sb-form_default', styles.wrapper), [])

  return (
    <div className={formClass}>
      <p className='sb-form__title text text_type_main-medium'>Восстановление пароля</p>
      <form className='sb-form__body' onSubmit={handleFormSubmit}>
        <div className='sb-form__body-input-el'>
          <Input
            type='text'
            placeholder='Укажите e-mail'
            onChange={handleFormChange}
            value={form.email}
            name='email'
            size='default'
          />
        </div>
        {/* Temporary solution */}
        <Button type='primary' size='large' onClick={handleClick}>
          Восстановить
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
  )
}

export default ForgotPasswordPage
