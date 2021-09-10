import { groupBy } from 'lodash';
import React, { ReactNode } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

import { ingredientsData } from '../../../common/utils/data';

import styles from './burger-constructor.module.css';
import classNames from 'classnames';

// NOTE: Will be refactored / redo in future sprints (if i won't be expelled)
// TODO: Think about pushing to a separate component, or wait review and proposal
type TElementWrapperProps = {
  className: string;
  children?: ReactNode;
};

type TElementDnDWrapper = TElementWrapperProps;

const BurgerConstructor = () => {
  const { bun, sauce, main } = groupBy(ingredientsData, 'type');

  const ElementWrapper = ({ className, children }: TElementWrapperProps) => (
    <div className={className}>{children}</div>
  );

  const ElementDnDWrapper = ({ className, children }: TElementDnDWrapper) => (
    <div className={className}>
      <DragIcon type='primary' />
      {children}
    </div>
  );

  return (
    <section className={styles.section}>
      <div className={styles.list}>
        <ElementWrapper className={styles.listItem}>
          <ConstructorElement
            type='top'
            isLocked={true}
            text={`${bun[0].name} (вверх)`}
            thumbnail={bun[0].image}
            price={bun[0].price}
          />
        </ElementWrapper>
        <div className={styles.listDnD}>
          {[...sauce, ...main].map((ingredient, index) => (
            <ElementDnDWrapper key={index} className={styles.listDnDItem}>
              <ConstructorElement
                text={ingredient.name}
                price={ingredient.price}
                thumbnail={ingredient.image}
              />
            </ElementDnDWrapper>
          ))}
        </div>
        <ElementWrapper className={styles.listItem}>
          <ConstructorElement
            type='bottom'
            isLocked={true}
            text={`${bun[0].name} (вверх)`}
            thumbnail={bun[0].image}
            price={bun[0].price}
          />
        </ElementWrapper>
      </div>
      <div className={styles.price}>
        <span className={classNames('text text_type_digits-medium', styles.priceValue)}>
          610
          <CurrencyIcon type='primary' />
        </span>
        <Button type='primary' size='large'>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

export default BurgerConstructor;
