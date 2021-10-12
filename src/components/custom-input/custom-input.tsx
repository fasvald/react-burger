import React, { forwardRef, Ref, useCallback, useImperativeHandle, useRef, useState } from 'react'

import { Input } from '@ya.praktikum/react-developer-burger-ui-components'

import { ICustomInputProps, ICustomInputRefProps } from './custom-input.model'

// NOTE: This component is custom copy paste from those links with additional changes:
// - https://github.com/yandex-praktikum/react-developer-burger-ui-components/blob/main/src/ui/password-input.tsx
// - https://github.com/yandex-praktikum/react-developer-burger-ui-components/blob/main/src/ui/email-input.tsx

const CustomInput = (
  { value, type, name, placeholder, size = 'default', onChange, validationCb }: ICustomInputProps,
  ref: Ref<ICustomInputRefProps>,
): JSX.Element => {
  const [fieldDisabled, setDisabled] = useState(true)
  const [error, setError] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleIconClick = useCallback(() => {
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

  const handleFocus = useCallback(() => {
    setError(false)
  }, [])

  const handleBlur = useCallback(
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

  // It's kind of hack to make workable "reset" form feature, because we need to make our form "clean => pristine" (Angular ref)
  useImperativeHandle(ref, () => ({
    setPristine: () => {
      setError(false)
    },
  }))

  return (
    <Input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      icon='EditIcon'
      value={value}
      ref={inputRef}
      onBlur={handleBlur}
      onFocus={handleFocus}
      name={name}
      error={error}
      disabled={fieldDisabled}
      onIconClick={handleIconClick}
      errorText='Ой, произошла ошибка!'
      size={size}
    />
  )
}

export default React.memo(forwardRef<ICustomInputRefProps, ICustomInputProps>(CustomInput))
