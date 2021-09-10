import { ReactNode } from 'react';
import { IBurgerIngredient } from '../../../../../common/models/data.model';

export interface IBurgerIngredientsListSectionProps {
  children?: ReactNode;
  className?: string;
  ingredients: IBurgerIngredient[];
}
