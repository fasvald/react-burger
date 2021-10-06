import React, { useMemo, useState } from 'react'

import { Button } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'

import CustomInput from '../../../components/custom-input/custom-input'

import styles from './personal-info-page.module.css'

const PersonalInfoPage = (): JSX.Element => {
  const [value, setValue] = useState('')

  const formWrapperClass = useMemo(
    () => classNames('sb-form sb-form_default sb-form_profile', styles.wrapper),
    [],
  )

  // TODO: Add isDisabled class
  const formClass = useMemo(() => classNames('sb-form__body'), [])

  return (
    <div className={formWrapperClass}>
      <form className={formClass}>
        <div className='sb-form__body-input-el'>
          <CustomInput
            type='text'
            name='name'
            placeholder='Имя'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className='sb-form__body-input-el'>
          <CustomInput
            type='email'
            name='login'
            placeholder='Логин'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className='sb-form__body-input-el'>
          <CustomInput
            type='password'
            name='password'
            placeholder='Пароль'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <Button type='primary' size='large'>
          {/* {resetPasswordStatus !== 'loading' && <span>Сохранить</span>}
          {resetPasswordStatus === 'loading' && (
            <Loader circularProgressProps={{ size: 26, color: 'secondary' }} />
          )} */}
          Сохранить
        </Button>
        <Button type='primary' size='large'>
          Отменить
        </Button>
      </form>
    </div>
  )
}

export default PersonalInfoPage
