import { IBurgerConstructorIngredientProps } from '../burger-constructor.model';

export interface IBurgerConstructorIngredientBunProps extends IBurgerConstructorIngredientProps {
  direction: 'top' | 'bottom';
}
