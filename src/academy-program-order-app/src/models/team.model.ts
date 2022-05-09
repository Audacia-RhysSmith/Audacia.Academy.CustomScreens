import type IdTextPair from './id-text-pair.model'

export default class Team {
  id: number
  name: string
  modules: IdTextPair[]

  /**
   * creates a new team
   */
  constructor(id: number, name: string, modules: IdTextPair[]) {
    this.id = id
    this.name = name
    this.modules = modules
  }
}
