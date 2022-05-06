class AcademyProgramPlanContext {
    private key =
    '';

  async getModules() {
    const res = await fetch(
      'https://api.gridfox.com/data/Modules?PageSize=1000&OrderBy=Ordinal&Descending=true',
      {
        headers: {
          'gridfox-api-key': this.key,
        },
      }
    );
    const data = await res.json();

    return data;
  }

  async getTeams() {
    const res = await fetch(
      'https://api.gridfox.com/data/Teams?PageSize=1000&Descending=true',
      {
        headers: {
          'gridfox-api-key': this.key,
        },
      }
    );
    const data = await res.json();

    return data;
  }

  async getTestTeams() {
    const res = await fetch(
      'https://api.gridfox.com/data/TestTeams?PageSize=1000&Descending=true',
      {
        headers: {
          'gridfox-api-key': this.key,
        },
      }
    );
    const data = await res.json();

    return data;
  }

  async getTestTeamModules() {
    const res = await fetch(
      'https://api.gridfox.com/data/TestTeamModules?PageSize=1000&Descending=true',
      {
        headers: {
          'gridfox-api-key': this.key,
        },
      }
    );
    const data = await res.json();

    return data;
  }

  async updateModules(reference, ordinalValue) {
    const up = {
      id: reference,
      ordinal: ordinalValue
    };

    const res = await fetch(
      'https://api.gridfox.com/data/TestTeamModules/' + reference,
      {
        method: 'PUT',
        headers: {
          'gridfox-api-key': this.key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(up)
      }
    );
  }
}

const academyProgramPlanContext = new AcademyProgramPlanContext();
export default academyProgramPlanContext;