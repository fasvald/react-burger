import React, { useRef, useState } from 'react'

import { Input } from '@ya.praktikum/react-developer-burger-ui-components'

import { ICustomInputProps } from './custom-input.model'

// NOTE: This component is custom copy paste from those links with additional changes:
// - https://github.com/yandex-praktikum/react-developer-burger-ui-components/blob/main/src/ui/password-input.tsx
// - https://github.com/yandex-praktikum/react-developer-burger-ui-components/blob/main/src/ui/email-input.tsx

const CustomInput = ({
  value,
  type,
  name,
  placeholder,
  size = 'default',
  onChange,
  validationCb,
}: ICustomInputProps): JSX.Element => {
  const [fieldDisabled, setDisabled] = useState(true)

  const [error, setError] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const onIconClick = () => {
    setDisabled(false)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const validateField = (valuee: string) => {
    // setError(!validateEmail(value))
  }

  const onFocus = () => {
    setError(false)
  }

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value) {
      validateField(e.target.value)
    } else {
      setError(false)
    }
    setDisabled(true)
  }
  return (
    <Input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      icon='EditIcon'
      value={value}
      ref={inputRef}
      onBlur={onBlur}
      onFocus={onFocus}
      name={name}
      error={error}
      disabled={fieldDisabled}
      onIconClick={onIconClick}
      errorText='Ой, произошла ошибка!'
      size={size}
    />
  )
}

export default CustomInput
