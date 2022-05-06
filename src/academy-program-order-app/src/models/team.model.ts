import TeamModule from "./team-module.model";

export default class Team {
    id: number;
    name: string;
    modules: TeamModule[];

    /**
     * creates a new team
     */
    constructor(id: number, name: string, modules: TeamModule[]) {
        this.id = id;
        this.name = name;
        this.modules = modules;
    }
}