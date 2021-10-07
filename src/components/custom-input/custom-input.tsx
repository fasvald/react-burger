import React, { useCallback, useRef, useState } from 'react'

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

  const onIconClick = useCallback(() => {
    setDisabled(false)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  const validateField = useCallback(
    (currentValue: string) => {
      if (validationCb) {
        setError(!validationCb(currentValue))
      }
    },
    [validationCb],
  )

  const onFocus = useCallback(() => {
    setError(false)
  }, [])

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      // NOTE: I don't want to customize it too deeply, again ui library is terrible raw and it's hard to check form status
      // like in Angular => dirty, pristine, etc. So will check it in JS
      // if (e.target.value || e.target.value === '') {
      if (e.target.value) {
        validateField(e.target.value)
      } else {
        setError(false)
      }

      setDisabled(true)
    },
    [validateField],
  )

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

export default React.memo(CustomInput)
