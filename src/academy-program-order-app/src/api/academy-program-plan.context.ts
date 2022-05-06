import gridfoxHttp from "./gridfox-http";

class AcademyProgramPlanContext {
    private key =
    '';

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

    return await gridfoxHttp.put('/data/TestTeamModules/' + reference, up);
  }
}

const academyProgramPlanContext = new AcademyProgramPlanContext();
export default academyProgramPlanContext;