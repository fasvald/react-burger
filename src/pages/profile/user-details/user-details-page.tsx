import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { Button } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { isEqual } from 'lodash'

import { isInstanceOfAxiosSerializedError } from '@common/guards/errors.guards'
import { isEmailValid, isNameValid, isPasswordValid } from '@common/utils/validators.utils'
import CustomInput from '@components/custom-input/custom-input'
import { ICustomInputRefProps } from '@components/custom-input/custom-input.model'
import LoaderCircular from '@components/loader-circular/loader-circular'
import { useAppDispatch, useAppSelector } from '@hooks'
import { getUser, userSelector, updateUser, saveUser } from '@services/slices/user.slice'

import { fetchUserStatusSelector, updateUserStatusSelector } from './user-details-page.slice'

import styles from './user-details-page.module.css'

const SUCCESS_MESSAGES: Record<string | number, string> = {
  default: 'Персональные данные профиля были изменены успешно.',
}

const ERROR_MESSAGES: Record<string | number, string> = {
  default: 'Возникла ошибка. Повторите, пожалуйста еще раз.',
  fetchProfileFailed: 'Возникла ошибка. Персональные данные не загрузились.',
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const UserDetailsPage = (): JSX.Element => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [isResetAvailable, setIsResetAvailable] = useState(false)
  const [severity, setSeverity] = useState<AlertColor>('error')
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const user = useAppSelector(userSelector)
  const userFetchStatus = useAppSelector(fetchUserStatusSelector)
  const userUpdateStatus = useAppSelector(updateUserStatusSelector)

  const formRef = useRef<HTMLFormElement>(null)
  const nameInputRef = useRef<ICustomInputRefProps>(null)
  const emailInputRef = useRef<ICustomInputRefProps>(null)
  const passwordInputRef = useRef<ICustomInputRefProps>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promiseUserUpdateRef = useRef<any>(null)

  const dispatch = useAppDispatch()

  const isFormValid = useCallback(() => {
    return isEmailValid(form.email) && isNameValid(form.name) && isPasswordValid(form.password)
  }, [form.email, form.name, form.password])

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

      if (!isFormValid() || isEqual(form, { ...user, password: '' })) {
        return
      }

      promiseUserUpdateRef.current = dispatch(updateUser(form))

      const resultAction = await promiseUserUpdateRef.current

      if (updateUser.rejected.match(resultAction)) {
        if (isInstanceOfAxiosSerializedError(resultAction.payload)) {
          setMessage(ERROR_MESSAGES[resultAction.payload.status || 'default'])
          setSeverity('error')
          setOpen(true)
        }
      }

      if (updateUser.fulfilled.match(resultAction)) {
        dispatch(saveUser(resultAction.payload.user))
        setMessage(SUCCESS_MESSAGES.default)
        setSeverity('success')
        setOpen(true)
      }
    },
    [dispatch, form, isFormValid, user],
  )

  const handleFormReset = useCallback(() => {
    if (!isEqual(form, { ...user, password: '' }) && user) {
      setForm({ ...user, password: '' })

      // Make form/inputs (great) pristine again
      nameInputRef.current?.setPristine()
      emailInputRef.current?.setPristine()
      passwordInputRef.current?.setPristine()
    }
  }, [form, user])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let promiseUserFetch: any

    // I don't want to add another wrappers, etc. but it's time consuming to do it properly
    // so we are doing "pro gamer moves" to set a proper type for buttons. Because unlucky for us the
    // provided UI is terrible in case of accessibility and default props drilling. We even can't set a type for a button,
    // so for other forms where it was one button it will work like a form submit thing.
    const formSaveBtnEl = formRef.current?.querySelectorAll('button')[0]
    const formCancelBtnEl = formRef.current?.querySelectorAll('button')[1]

    if (formSaveBtnEl) {
      formSaveBtnEl.setAttribute('type', 'submit')
    }

    if (formCancelBtnEl) {
      formCancelBtnEl.setAttribute('type', 'button')
    }

    const fetchUser = async () => {
      promiseUserFetch = dispatch(getUser())

      const resultAction = await promiseUserFetch

      if (getUser.fulfilled.match(resultAction)) {
        setForm({ ...resultAction.payload.user, password: '' })
        dispatch(saveUser(resultAction.payload.user))
      }
    }

    // So we check if the user is logged in (with tokens and fetch the data)
    if (user) {
      setForm({ ...user, password: '' })
    } else {
      fetchUser()
    }

    return () => {
      promiseUserFetch && promiseUserFetch?.abort()
    }
  }, [dispatch, user])

  useEffect(() => {
    setIsResetAvailable(!isEqual(form, { ...user, password: '' }))
  }, [form, user])

  useEffect(() => {
    return () => {
      promiseUserUpdateRef.current && promiseUserUpdateRef.current?.abort()
    }
  }, [])

  const formWrapperClass = useMemo(
    () => classNames('sb-form sb-form_default sb-form_profile', styles.wrapper),
    [],
  )

  const formClass = useMemo(
    () =>
      classNames(
        'sb-form__body',
        !isFormValid() || isEqual(form, { ...user, password: '' }) ? 'isDisabled' : '',
        isResetAvailable ? '' : 'isResetDisabled',
      ),
    [isFormValid, form, user, isResetAvailable],
  )

  if (userFetchStatus === 'error') {
    return (
      <div className={styles.error}>
        <p className='text text_type_main-medium'>{ERROR_MESSAGES.fetchProfileFailed}</p>
      </div>
    )
  }

  if (userFetchStatus === 'loading') {
    return <LoaderCircular />
  }

  return (
    <>
      <div className={formWrapperClass}>
        {user && (
          <form className={formClass} ref={formRef} onSubmit={handleFormSubmit}>
            <div className='sb-form__body-input-el'>
              <CustomInput
                ref={nameInputRef}
                type='text'
                name='name'
                placeholder='Имя'
                value={form.name}
                onChange={handleFormChange}
                validationCb={isNameValid}
              />
            </div>
            <div className='sb-form__body-input-el'>
              <CustomInput
                ref={emailInputRef}
                type='email'
                name='email'
                placeholder='Email'
                value={form.email}
                onChange={handleFormChange}
                validationCb={isEmailValid}
              />
            </div>
            <div className='sb-form__body-input-el'>
              <CustomInput
                ref={passwordInputRef}
                type='password'
                name='password'
                placeholder='Введите новый пароль'
                value={form.password}
                onChange={handleFormChange}
                validationCb={isPasswordValid}
              />
            </div>
            <Button type='primary' size='large'>
              {userUpdateStatus !== 'loading' && <span>Сохранить</span>}
              {userUpdateStatus === 'loading' && (
                <LoaderCircular circularProgressProps={{ size: 26, color: 'secondary' }} />
              )}
            </Button>
            <Button type='secondary' size='large' onClick={handleFormReset}>
              Отменить
            </Button>
          </form>
        )}
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default React.memo(UserDetailsPage)
