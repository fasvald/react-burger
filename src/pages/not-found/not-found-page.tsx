import React from 'react'

import { Link, Navigate } from 'react-router-dom'

import styles from './not-found-page.module.css'

export const RedirectToNotFound = (): JSX.Element => {
  return <Navigate to='/not-found' />
}

const NotFoundPage = (): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <p className='text text_type_digits-large'>404</p>
        <p className='text text_type_main-large'>Бургеры не найдены</p>
        <p className='text text_type_main-default'>
          <span className='text_color_inactive'>Вы потерялись? </span>
          <Link className={styles.link} to='/'>
            Вернуться на главную
          </Link>
        </p>
      </div>
      <div className={styles.imgWrapper} />
    </div>
  )
}

export default NotFoundPage
