import React from 'react'

const OrderListPage = (): JSX.Element => {
  return (
    <div style={{ marginLeft: '60px' }}>
      <p className='text text_type_main-medium'>История заказов</p>
    </div>
  )
}

export default React.memo(OrderListPage)
