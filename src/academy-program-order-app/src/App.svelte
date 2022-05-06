<script lang="ts">
  import DragDropList from "./lib/DragDropList.svelte";
  import academyProgramPlanContext from './api/academy-program-plan.context';

  let readonlyModules = [];

  // let teams = [];

  let teams = [];
  let teamModules = [];

  const mapModules = (data) => {
    readonlyModules = data.records.map((item) => ({
      id: item.id,
      text: item.name
    }));
  };

  const mapTeams = (data) => {
    teams = data.records.map((item) => ({
      id: item.id,
      name: item.name,
      modules: []
    }));
  };

  const mapTeamModules = (data) => {
    teamModules = data.records.map((item) => ({
      id: item.id,
      moduleId: item.module,
      teamId: item.team,
      ordinal: item.ordinal,
    }));
  };

  const gridfoxCalls = [
    {call: academyProgramPlanContext.getModules(),      func: mapModules},
    {call: academyProgramPlanContext.getTeams(),        func: mapTeams },
    {call: academyProgramPlanContext.getTeamModules(),  func: mapTeamModules },
  ];


  // Seens as though each call is independant of each other
  // We can call all endpoints asynchronously using Promise.all 

  Promise.all(gridfoxCalls.map((item) => item.call)).then((values) => {
    
    // values is each to and array of each calls returned data;
    // promise.all keeps the order of the request the same so we can use index
    values.forEach((value, index) => {
      // Run each func for each call value
      gridfoxCalls[index].func(value);
    });

    teams.forEach((team, index) => {
      console.log(team);
      teams[index] = academyProgramPlanContext.getModulesForTeam(teamModules, readonlyModules, team);
    });
  });

  function update(event) {
    const updateRequests = [];
    // go through and find the each of the modules to update the index
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      
      // update the ordinal
      for (let j = 0; j < team.modules.length; j++) {
        const element = team.modules[j];

        const ttm = teamModules.filter((p)=> p.moduleId === element.id && p.teamId === team.id);

        if (ttm.length === 1) {

          const req = academyProgramPlanContext.updateModules(ttm[0].id, j);
          console.log(req);
          updateRequests.push(req);
        }
        
      }
    }

    Promise.all(updateRequests).then((res) => {
      console.log('done');
    });
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
