<script lang="ts">
  import DragDropList from "./lib/DragDropList.svelte";
  import {differenceWith, isEqual, cloneDeep} from "lodash";
  import academyProgramPlanContext from './api/academy-program-plan.context';
  import IdTextPair from './models/id-text-pair.model'
  import Team from './models/team.model';
  import TeamModule from './models/team-module.model';

  let readonlyModules = [] as IdTextPair[];
  let teams = [] as Team[];
  let teamModules = [] as TeamModule[];
  let cachedTeamModules = [] as TeamModule[];

  const mapModules = (data: any) => {
    readonlyModules = data.records.map((item: any) => { return new IdTextPair(item.id, item.name) });
  };

  const mapTeams = (data: any) => {
    teams = data.records.map((item: any) => { return new Team(item.id, item.name, []) });
  };

  const mapTeamModules = (data: any) => {
    teamModules = data.records.map((item: any) => { return new TeamModule(item.id, item.module, item.team, item.ordinal) });
    cachedTeamModules = cloneDeep(teamModules);
  };

  const gridfoxCalls = [
    {call: academyProgramPlanContext.getModules(),      func: mapModules},
    {call: academyProgramPlanContext.getTeams(),        func: mapTeams },
    {call: academyProgramPlanContext.getTeamModules(),  func: mapTeamModules },
  ];

  // Seens as though each call is independant of each other :heavy_check_mark:
  // We can call all endpoints asynchronously using Promise.all 

  Promise.all(gridfoxCalls.map((item) => item.call)).then((values) => {
    // values is each to and array of each calls returned data;
    // promise.all keeps the order of the request the same so we can use index
    values.forEach((value, index) => {
      // Run each func for each call value
      gridfoxCalls[index].func(value);
    });

    teams.forEach((team, index) => {
      teams[index] = getModulesForTeam(teamModules, readonlyModules, team);
    });
  });

  function getModulesForTeam(teamModules: TeamModule[], readonlyModules: IdTextPair[], team: Team) {
    const modules = [] as TeamModule[];
    const qaModules = teamModules.filter((p) => p.teamId === team.id).sort((a, b) => a.ordinal - b.ordinal);
    qaModules.forEach((teamModule, index) => {

      const foundModuleIndex = readonlyModules.findIndex((moduleItem) => moduleItem.id === teamModule.moduleId);
      if (foundModuleIndex > -1) {
        const foundModule = readonlyModules[foundModuleIndex];

        modules.push(new TeamModule(foundModule.id, foundModule.id, teamModule.teamId, index));
        // foundModule.ordinal = index;
        // modules.push(foundModule);
      }
    });
    team.modules = modules;
    
    return team;
  }

  // Updates the Team Modules when a module is dragged
  function update(event: any) {
    recalculateOrdinals();
    const teamModuleDifferences = differenceWith(teamModules, cachedTeamModules, isEqual);

    console.log('teamModuleDifferences', teamModuleDifferences);

    const requests = [] as Promise<any>[];
    teamModuleDifferences.forEach((item: any, index: number) => {
      const request = academyProgramPlanContext.updateModules(item.id, item.ordinal);
      requests.push(request);
    });

    console.log(requests.length);

    Promise.all(requests).then((res) => { });    
  }

  // Recalculate the ordinals for the modules
  function recalculateOrdinals() {
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      
      for (let j = 0; j < team.modules.length; j++) {
        const element = team.modules[j];
        const filterTeamModules = teamModules.filter((p)=> p.moduleId === element.id && p.teamId === team.id);

        if (filterTeamModules.length === 1) {
          filterTeamModules[0].ordinal = j;  
        }
      }
    }
  }
</script>

<main>
  <div class="teams">
    {#each teams as team, index}
    <div class="role">
      <div class="role__title">{team.name}</div>
      <div class="role__modules">
        <DragDropList on:dragEnd={update} bind:data={team.modules}/>
      </div>
    </div>
    {/each}
  </div>

</main>

<style lang="scss">
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  :global(body) {
    background: #fbfbfb;
  }

  :global(.dragdroplist) {}
  :global(.dragdroplist > .list > div.item) {
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 6px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    
  }
  :global(.dragdroplist div.buttons > button.down) {}
  :global(.dragdroplist div.content) {
    width: 100%;
    padding: 0 15px;
    text-align: left;
    border-left: 1px solid rgba(0,0,0,0.1);
    white-space: nowrap;
  }

  .teams {
    margin: auto;
    padding: 20px;
    display: grid;
    align-items: flex-start;
    justify-content: center;
    grid-template-columns: repeat(3, min-content);
    grid-column-gap: 40px;
    
    .role {
      width: fit-content;
      background: darken(#fbfbfb, 3%);
      border-radius: 8px;
      padding: 20px;

      &__title {
        font-size: 1.4rem;
        font-weight: 600;
        margin: 0 0 20px;
      }

      &__modules {
        margin: auto;

        .module {
          margin: 15px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 6px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          display: flex;

          .cell {
            padding: 15px;

            &:first-child {
              flex-grow: 1;
            }

            &:last-child {
              flex-direction: column;
              align-items: flex-end;
              display: flex;
            }
          }

          .title {
            margin: 0 0 10px;
            font-size: 0.8rem;
            color: gray;
          }

          .teams {
            flex-wrap: wrap;
            display: flex;
            gap: 6px;
          }

          .team {
            padding: 4px 8px;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 4px;
          }
        }
      }
    }
  }
</style>
