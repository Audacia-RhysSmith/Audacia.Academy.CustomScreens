import type Module from './module.model'

export default class Team {
  id: number
  name: string
  modules: Module[]

  /**
   * creates a new team
   */
  constructor(id: number, name: string, modules: Module[]) {
    this.id = id
    this.name = name
    this.modules = modules
  }
}
