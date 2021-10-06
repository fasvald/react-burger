import React, { SyntheticEvent, useCallback, useMemo, useState } from 'react'

import { Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { Link, useHistory } from 'react-router-dom'

import Loader from '../../components/loader/loader'
import { useAppDispatch, useAppSelector } from '../../hooks'

import { resetPassword, resetPasswordStatusSelector } from './reset-password-page.slice'

import styles from './reset-password-page.module.css'

const ResetPasswordPage = (): JSX.Element => {
  const resetPasswordStatus = useAppSelector(resetPasswordStatusSelector)
  const [form, setForm] = useState({ password: '', code: '' })

  const dispatch = useAppDispatch()
  const history = useHistory()

  const handleFormChange = useCallback((e: SyntheticEvent) => {
    setForm((prevState) => ({
      ...prevState,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
    }))
  }, [])

  // TODO: Add request aborting feature here + in other places
  const handleFormSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault()

      if (!form.password || form.password.length < 6) {
        return
      }

      // TODO: Inject token from cookie OR interceptor
      const resultAction = await dispatch(resetPassword({ password: form.password, token: '' }))

      // Based on https://redux-toolkit.js.org/usage/usage-with-typescript#createasyncthunk
      if (resetPassword.rejected.match(resultAction)) {
        return
      }

      history.push('/login')
    },
    [dispatch, form.password, history],
  )

  const formWrapperClass = useMemo(
    () => classNames('sb-form sb-form_default sb-form_reset-password', styles.wrapper),
    [],
  )

  const formClass = useMemo(
    () =>
      classNames('sb-form__body', !form.password || form.password.length < 6 ? 'isDisabled' : ''),
    [form.password],
  )

  return (
    <div className={formWrapperClass}>
      <p className='sb-form__title text text_type_main-medium'>Восстановление пароля</p>
      <form className={formClass} onSubmit={handleFormSubmit}>
        <div className='sb-form__body-input-el'>
          <PasswordInput onChange={handleFormChange} value={form.password} name='password' />
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
  )
}

export default ResetPasswordPage
