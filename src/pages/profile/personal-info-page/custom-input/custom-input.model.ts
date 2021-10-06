export type TInputTypes = 'text' | 'email' | 'password' | undefined

export interface ICustomInputProps {
  // Easy possibility to extend it with ref + forwardRef component wrapper
  value: string
  type: TInputTypes
  name: string
  placeholder: string
  // It could be used for a better customization but let's assume the all those input elements will be only for profile page
  // icon: {
  //   name: string
  //   onClickCb?: () => void
  // }
  size?: 'default' | 'small'
  onChange(e: React.ChangeEvent<HTMLInputElement>): void
  validationCb?: (value: string) => boolean
}
