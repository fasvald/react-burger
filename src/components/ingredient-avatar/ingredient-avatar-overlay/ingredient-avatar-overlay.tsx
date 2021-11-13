import React from 'react'

import styles from './ingredient-avatar-overlay.module.css'

interface IIngredientAvatarOverlayProps {
  content: string
}

const IngredientAvatarOverlay = ({ content }: IIngredientAvatarOverlayProps): JSX.Element => {
  return (
    <div className={styles.avatarOverlay}>
      <p className='text text_type_digits-default'>{content}</p>
    </div>
  )
}

export default React.memo(IngredientAvatarOverlay)
