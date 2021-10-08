import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { Button } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { isEqual } from 'lodash'

import { instanceOfAxiosSerializedError } from '../../../common/utils/errors.utils'
import { isEmailValid, isNameValid } from '../../../common/utils/validators.utils'
import CustomInput from '../../../components/custom-input/custom-input'
import Loader from '../../../components/loader/loader'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import {
  getProfile,
  profileFetchStatusSelector,
  profileSelector,
  updateProfileManually,
} from '../../../services/slices/profile.slice'

import { updateProfile, updateProfileStatusSelector } from './personal-info-page.slice'

import styles from './personal-info-page.module.css'

const SUCCESS_MESSAGES: Record<string | number, string> = {
  default: 'Персональные данные профиля были изменены успешно.',
}

const ERROR_MESSAGES: Record<string | number, string> = {
  default: 'Возникла ошибка. Повторите, пожалуйста еще раз.',
  fetchProfileFailed: 'Возникла ошибка. Персональные данные не загрузились.',
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const PersonalInfoPage = (): JSX.Element => {
  const [form, setForm] = useState({ name: '', email: '' })
  const [isResetAvailable, setIsResetAvailable] = useState(false)
  const [severity, setSeverity] = useState<AlertColor>('error')
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const profile = useAppSelector(profileSelector)
  const profileFetchStatus = useAppSelector(profileFetchStatusSelector)
  const profileUpdateStatus = useAppSelector(updateProfileStatusSelector)

  const formRef = useRef<HTMLFormElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promiseRef = useRef<any>(null)

  const dispatch = useAppDispatch()

  const isFormValid = useCallback(() => {
    return isEmailValid(form.email) && isNameValid(form.name)
  }, [form.email, form.name])

  const handleSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
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

      if (!isFormValid() || isEqual(form, profile)) {
        return
      }

      promiseRef.current = dispatch(updateProfile(form))

      const resultAction = await promiseRef.current

      if (updateProfile.rejected.match(resultAction)) {
        if (instanceOfAxiosSerializedError(resultAction.payload)) {
          setMessage(ERROR_MESSAGES[resultAction.payload.status || 'default'])
          setSeverity('error')
          setOpen(true)
        }
      }

      if (updateProfile.fulfilled.match(resultAction)) {
        setMessage(SUCCESS_MESSAGES.default)
        setSeverity('success')
        setOpen(true)

        dispatch(updateProfileManually(form))
      }
    },
    [dispatch, form, isFormValid, profile],
  )

  const handleFormReset = useCallback(() => {
    if (!isEqual(form, profile) && profile) {
      setForm(profile)
    }
  }, [form, profile])

  useEffect(() => {
    return () => {
      promiseRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let promise: any

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

    const fetchProfile = async () => {
      promise = dispatch(getProfile())

      const resultAction = await promise

      if (getProfile.fulfilled.match(resultAction)) {
        setForm(resultAction.payload.user)
      }
    }

    // So we check if the user is logged in (with tokens and fetch the data)
    if (profile) {
      setForm(profile)
    } else {
      fetchProfile()
    }

    return () => {
      promise?.abort()
    }
  }, [dispatch, profile])

  useEffect(() => {
    setIsResetAvailable(!isEqual(form, profile))
  }, [form, profile])

  const formWrapperClass = useMemo(
    () => classNames('sb-form sb-form_default sb-form_profile', styles.wrapper),
    [],
  )

  const formClass = useMemo(
    () => classNames('sb-form__body', !isFormValid() || isEqual(form, profile) ? 'isDisabled' : ''),
    [isFormValid, form, profile],
  )

  if (profileFetchStatus === 'error') {
    return (
      <div className={styles.error}>
        <p className='text text_type_main-medium'>{ERROR_MESSAGES.fetchProfileFailed}</p>
      </div>
    )
  }

  if (profileFetchStatus === 'loading') {
    return <Loader />
  }

  return (
    <>
      <div className={formWrapperClass}>
        {profile && (
          <form className={formClass} ref={formRef} onSubmit={handleFormSubmit}>
            <div className='sb-form__body-input-el'>
              <CustomInput
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
                type='email'
                name='email'
                placeholder='Email'
                value={form.email}
                onChange={handleFormChange}
                validationCb={isEmailValid}
              />
            </div>
            <Button type='primary' size='large'>
              {profileUpdateStatus !== 'loading' && <span>Сохранить</span>}
              {profileUpdateStatus === 'loading' && (
                <Loader circularProgressProps={{ size: 26, color: 'secondary' }} />
              )}
            </Button>
            {isResetAvailable && (
              <Button type='secondary' size='large' onClick={handleFormReset}>
                Отменить
              </Button>
            )}
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

export default React.memo(PersonalInfoPage)
