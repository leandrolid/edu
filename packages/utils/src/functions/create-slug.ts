import { dash } from 'radash'

export const createSlug = (text: string): string => {
  return dash(text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
}
