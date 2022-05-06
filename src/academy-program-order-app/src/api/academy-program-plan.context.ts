import gridfoxHttp from "./gridfox-http";

class AcademyProgramPlanContext {
  async getModules() {
    return await gridfoxHttp.get('/data/Modules?PageSize=1000&OrderBy=Ordinal&Descending=true');
  }

  async getTeams() {
    return await gridfoxHttp.get('/data/Teams?PageSize=1000&Descending=true');
  }

  async getTeamModules() {
    return await gridfoxHttp.get('/data/TeamModules?PageSize=1000&Descending=true');
  }

  async updateModules(reference, ordinalValue) {
    const up = {
      id: reference,
      ordinal: ordinalValue
    };
    console.log(reference, up);
    // return await gridfoxHttp.put('/data/TestTeamModules/' + reference, up);
  }

  getModulesForTeam (teamModules, readonlyModules, team) {
    const modules = [];
    const qaModules = teamModules.filter((p) => p.teamId === team.id).sort((a, b) => a.ordinal - b.ordinal);
    qaModules.forEach((teamModule, index) => {

      const foundModuleIndex = readonlyModules.findIndex((moduleItem) => moduleItem.id === teamModule.moduleId);
      if (foundModuleIndex > -1) {
        const foundModule = readonlyModules[foundModuleIndex];
        modules.push(foundModule);
      }
    });
    team.modules = modules;
    console.log(modules);
    return team;
  }
}

const academyProgramPlanContext = new AcademyProgramPlanContext();
export default academyProgramPlanContext;