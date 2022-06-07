import type IdTextPairWithLink from './id-text-pair-with-link.model'
import type IdTextPair from './id-text-pair.model'

export default class Team {
  id: number
  name: string
  modules: IdTextPairWithLink[]

  /**
   * creates a new team
   */
  constructor(id: number, name: string, modules: IdTextPairWithLink[]) {
    this.id = id
    this.name = name
    this.modules = modules
  }
}
