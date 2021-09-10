import React from 'react';

import AppHeader from './app-header/app-header';
import AppContent from './app-content/app-content';
import AppFooter from './app-footer/app-footer';
import BurgerIngredients from '../burgers/burger-ingredients/burger-ingredients';

import styles from './app.module.css';

function App () {
  return (
    <>
      <AppHeader className={styles.header} />
      <AppContent className={styles.content}>
        <BurgerIngredients />
      </AppContent>
      <AppFooter className={styles.footer} />
    </>
  );
}

export default App;
