import React from 'react';

import AppHeader from './app-header/app-header';
import AppContent from './app-content/app-content';
import AppFooter from './app-footer/app-footer';
import BurgerIngredients from '../burger/burger-ingredients/burger-ingredients';

import appStyles from './app.module.css';

function App () {
  return (
    <>
      <AppHeader className={appStyles['app-header']} />
      <AppContent className={appStyles['app-content']}>
        <BurgerIngredients />
      </AppContent>
      <AppFooter className={appStyles['app-footer']} />
    </>
  );
}

export default App;
