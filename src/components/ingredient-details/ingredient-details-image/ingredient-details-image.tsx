import React from 'react'

import classNames from 'classnames'

import { IIngredientDetailsImageProps } from './ingredient-details-image.model'

import styles from './ingredient-details-image.module.css'

const IngredientDetailsImage = ({
  className,
  image,
  height,
}: IIngredientDetailsImageProps): JSX.Element => {
  const imgContainerClass = classNames(styles.img, className)

  return (
    <div
      className={imgContainerClass}
      style={{
        backgroundImage: `url(${image})`,
        height,
      }}
    />
  )
}

export default React.memo(IngredientDetailsImage)
