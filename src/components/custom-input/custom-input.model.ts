export type TInputTypes = 'text' | 'email' | 'password' | undefined

export interface ICustomInputProps {
  value: string
  type: TInputTypes
  name: string
  placeholder: string
  size?: 'default' | 'small'
  onChange(e: React.ChangeEvent<HTMLInputElement>): void
  validationCb?: (value: string) => boolean | null
}

export interface ICustomInputRefProps {
  setPristine: () => void
}
