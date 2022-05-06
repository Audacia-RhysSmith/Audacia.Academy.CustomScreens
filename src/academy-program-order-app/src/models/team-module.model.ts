export default class TeamModule {
    id: number;
    moduleId: number;
    teamId: number;
    ordinal: number;

    /**
     * creates a new team module - which is the many many link between teams and modules
     * along with the ordinal value which is the order in which the module should be taught
     */
    constructor(id: number, moduleId: number, teamId: number, ordinal: number) {
        this.id = id;
        this.moduleId = moduleId;
        this.teamId = teamId;
        this.ordinal = ordinal;
    }
}