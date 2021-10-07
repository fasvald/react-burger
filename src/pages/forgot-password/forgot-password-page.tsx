import React, { SyntheticEvent, useCallback, useMemo, useState } from 'react'

import { Button, EmailInput } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { Link, useHistory } from 'react-router-dom'

import { isEmailValid } from '../../common/utils/validators.utils'
import Loader from '../../components/loader/loader'
import { useAppDispatch, useAppSelector } from '../../hooks'

import {
  passwordForgotStatusSelector,
  sendPasswordRestorationEmail,
} from './forgot-password-page.slice'

import styles from './forgot-password-page.module.css'

const ForgotPasswordPage = (): JSX.Element => {
  const [form, setForm] = useState({ email: '' })
  const passwordForgotStatus = useAppSelector(passwordForgotStatusSelector)

  const dispatch = useAppDispatch()
  const history = useHistory()

  const handleFormChange = useCallback((e: SyntheticEvent) => {
    setForm((prevState) => ({
      ...prevState,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
    }))
  }, [])

  const isFormValid = useCallback(() => {
    return isEmailValid(form.email)
  }, [form.email])

  const handleFormSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault()

      // Due to not supporting props drilling of UI library I can't use such libraries like react-hook-forms and can't do
      // a proper form validation, so I got an approval to omit it at all, but I will try to check is via JS + RegExp...
      if (!isFormValid()) {
        return
      }

      const resultAction = await dispatch(sendPasswordRestorationEmail(form))

      if (sendPasswordRestorationEmail.rejected.match(resultAction)) {
        return
      }

      history.push('/reset-password')
    },
    [dispatch, form, history, isFormValid],
  )

  const formWrapperClass = useMemo(
    () => classNames('sb-form sb-form_default sb-form_forgot-password', styles.wrapper),
    [],
  )

  const formClass = useMemo(
    () => classNames('sb-form__body', !isFormValid() ? 'isDisabled' : ''),
    [isFormValid],
  )

  return (
    <div className={formWrapperClass}>
      <p className='sb-form__title text text_type_main-medium'>Восстановление пароля</p>
      <form className={formClass} onSubmit={handleFormSubmit}>
        <div className='sb-form__body-input-el'>
          <EmailInput onChange={handleFormChange} value={form.email} name='email' />
        </div>
        <Button type='primary' size='large'>
          {passwordForgotStatus !== 'loading' && <span>Восстановить</span>}
          {passwordForgotStatus === 'loading' && (
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

export default ForgotPasswordPage
