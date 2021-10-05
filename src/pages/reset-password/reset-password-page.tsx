import React, { SyntheticEvent, useCallback, useMemo, useState } from 'react'

import { Button, Input } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import styles from './reset-password-page.module.css'

const ResetPasswordPage = (): JSX.Element => {
  const [form, setForm] = useState({ password: '', code: '' })

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
      <p className='sb-form__title text text_type_main-medium'>Восстановление пароля</p>
      <form className='sb-form__body' onSubmit={handleFormSubmit}>
        <div className='sb-form__body-input-el'>
          <Input
            type='text'
            placeholder='Введите новый пароль'
            onChange={handleFormChange}
            icon='ShowIcon'
            // onIconClick={onIconClick}
            value={form.password}
            name='password'
            size='default'
          />
        </div>
        <div className='sb-form__body-input-el'>
          <Input
            type='text'
            placeholder='Введите код из письма'
            onChange={handleFormChange}
            value={form.code}
            name='code'
            size='default'
          />
        </div>
        <Button type='primary' size='large'>
          Сохранить
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

export default ResetPasswordPage
