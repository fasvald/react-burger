import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { isEqual } from 'lodash'

import { isEmailValid, isNameValid } from '../../../common/utils/validators.utils'
import CustomInput from '../../../components/custom-input/custom-input'
import Loader from '../../../components/loader/loader'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import {
  getProfile,
  profileFetchStatusSelector,
  profileSelector,
  updateProfileInStore,
} from '../../../services/slices/profile.slice'

import { updateProfile, updateProfileStatusSelector } from './personal-info-page.slice'

import styles from './personal-info-page.module.css'

const PersonalInfoPage = (): JSX.Element => {
  const profile = useAppSelector(profileSelector)
  const profileFetchStatus = useAppSelector(profileFetchStatusSelector)
  const profileUpdateStatus = useAppSelector(updateProfileStatusSelector)

  const [form, setForm] = useState({ name: '', email: '' })
  const [isResetAvailable, setIsResetAvailable] = useState(false)

  const dispatch = useAppDispatch()

  const formRef = useRef<HTMLFormElement>(null)

  const isFormValid = useCallback(() => {
    return isEmailValid(form.email) && isNameValid(form.name)
  }, [form.email, form.name])

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

      const resultAction = await dispatch(updateProfile(form))

      if (updateProfile.fulfilled.match(resultAction)) {
        dispatch(updateProfileInStore(form))
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
      const resultAction = await dispatch(getProfile())

      if (getProfile.fulfilled.match(resultAction)) {
        setForm(resultAction.payload.user)
      }
    }

    fetchProfile()
  }, [dispatch])

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

  // NOTE: I've read and seen that you can set couple of returns for better readability
  return profileFetchStatus === 'loading' ? (
    <Loader />
  ) : (
    <div className={formWrapperClass}>
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
    </div>
  )
}

// TODO: React memo FOR ALL new things
export default PersonalInfoPage
