import React, { SyntheticEvent, useCallback, useMemo, useState } from 'react'

import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { Link, useHistory } from 'react-router-dom'

import { isEmailValid, isNameValid, isPasswordValid } from '../../common/utils/validators.utils'
import Loader from '../../components/loader/loader'
import { useAppDispatch, useAppSelector } from '../../hooks'

import { signUp, signUpStatusSelector } from './register-page.slice'

import styles from './register-page.module.css'

const RegisterPage = (): JSX.Element => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const signUpStatus = useAppSelector(signUpStatusSelector)

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

      const resultAction = await dispatch(signUp(form))

      if (signUp.rejected.match(resultAction)) {
        return
      }

      history.push('/login')
    },
    [dispatch, form, history],
  )

  const isValidForm = useCallback(() => {
    return isEmailValid(form.email) && isPasswordValid(form.password) && isNameValid(form.name)
  }, [form.email, form.password, form.name])

  const formWrapperClass = useMemo(
    () => classNames('sb-form sb-form_default sb-form_register', styles.wrapper),
    [],
  )

  const formClass = useMemo(
    () => classNames('sb-form__body', !isValidForm() ? 'isDisabled' : ''),
    [isValidForm],
  )

  return (
    <div className={formWrapperClass}>
      <p className='sb-form__title text text_type_main-medium'>Регистрация</p>
      <form className={formClass} onSubmit={handleFormSubmit}>
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
  )
}

export default RegisterPage
