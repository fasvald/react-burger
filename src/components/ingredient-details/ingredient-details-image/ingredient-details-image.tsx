import React, { useMemo } from 'react'

import classNames from 'classnames'

import styles from './ingredient-details-image.module.css'

interface IIngredientDetailsImageProps {
  className?: string
  image: string
  height: string
}

const IngredientDetailsImage = ({
  className,
  image,
  height,
}: IIngredientDetailsImageProps): JSX.Element => {
  const imgStyle = useMemo(
    () => ({
      backgroundImage: `url(${image})`,
      height,
    }),
    [image, height],
  )

  const imgContainerClass = useMemo(() => classNames(styles.img, className), [className])

  return <div className={imgContainerClass} style={imgStyle} />
}

export default React.memo(IngredientDetailsImage)
