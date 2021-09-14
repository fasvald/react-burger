import { RefObject } from 'react'

import { IBurgerIngredient } from '../../common/models/data.model'
import { IModalRefObject } from '../modal/modal.model'

export interface IIngredientDetailsProps {
  ingredient: IBurgerIngredient
  modal: RefObject<IModalRefObject>
}
