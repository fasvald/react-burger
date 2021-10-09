export type TFetchProcess = 'idle' | 'loading' | 'loaded' | 'error'

export type TFetchProcessIdle = Extract<TFetchProcess, 'idle'>

export type TFetchProcessLoading = Extract<TFetchProcess, 'loading'>

export type TFetchProcessLoaded = Extract<TFetchProcess, 'loaded'>

export type TFetchProcessError = Extract<TFetchProcess, 'error'>

export type TBurgerIngredientType = 'bun' | 'sauce' | 'main'
