import React, { ReactNode, useMemo } from 'react'

import classNames from 'classnames'

import styles from './ingredient-avatar.module.css'

interface IIngredientAvatarProps {
  className?: string
  overlay?: ReactNode
  imageSrc: string
  style: {
    width: React.CSSProperties['width']
    height: React.CSSProperties['height']
    opacity?: React.CSSProperties['opacity']
  }
}

const IngredientAvatar = ({ className, overlay, imageSrc, style }: IIngredientAvatarProps) => {
  const wrapperClass = useMemo(() => classNames(className, styles.avatarWrapper), [className])

  return (
    <div className={wrapperClass} style={{ width: style.width, height: style.height }}>
      <img src={imageSrc} style={style} alt='Ingredient Avatar' />
      {overlay}
    </div>
  )
}

export default React.memo(IngredientAvatar)
