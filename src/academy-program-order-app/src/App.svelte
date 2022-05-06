<script lang="ts">
  import DragDropList from "svelte-dragdroplist";
  import academyProgramPlanContext from './api/academy-program-plan.context';

  let readonlyModules = [];

  let teams = [];

  let testTeams = [];
  let testTeamModules = [];


  academyProgramPlanContext.getModules().then(data => {
    readonlyModules = data.records.map((item) => {
      return {
        id: item.id,
        text: item.name
      }
    });

    academyProgramPlanContext.getTeams().then(data => {
      teams = data.records.map((item) => {
        return {
          id: item.id,
          text: item.name,
          modules: item.modules.map((module, index) => {
            // find in modules
            const foundModuleIndex = readonlyModules.findIndex((moduleItem) => moduleItem.id === module.referenceFieldValue);

            if (foundModuleIndex > -1) {
              const foundModule = readonlyModules[foundModuleIndex];
              return {
                id: foundModule.id,
                text: foundModule.text
              }
            }
                    
          })
        }
      });
    });

    academyProgramPlanContext.getTestTeams().then(data => {
      testTeams = data.records.map((item) => {
        return {
          id: item.id,
          name: item.name,
          modules: []
        }
      });

      academyProgramPlanContext.getTestTeamModules().then(data => {
      testTeamModules = data.records.map((item) => {
        return {
          id: item.id,
          moduleId: item.module,
          teamId: item.testTeam,
          ordinal: item.ordinal,
        }
      });
      
      // need to map everything together now...
      //qa
      const qaModules = testTeamModules.filter((p) => p.teamId === 3).sort((a, b) => a.ordinal - b.ordinal);
      for (let index = 0; index < qaModules.length; index++) {
        const teamModule = qaModules[index];
        
        const teamIndex = testTeams.findIndex((testTeam) => testTeam.id === teamModule.teamId);
        if (teamIndex > -1) {
          let team = testTeams[teamIndex];
          
          const foundModuleIndex = readonlyModules.findIndex((moduleItem) => moduleItem.id === teamModule.moduleId);

          if (foundModuleIndex > -1) {
            const foundModule = readonlyModules[foundModuleIndex];
            // console.log(foundModule);
           
            team.modules.push(foundModule);
          }

          testTeams[teamIndex] = team;
        }
      }

      // full
      const fullModules = testTeamModules.filter((p) => p.teamId === 1).sort((a, b) => a.ordinal - b.ordinal);

      for (let index = 0; index < fullModules.length; index++) {
        const teamModule = fullModules[index];
        
        const teamIndex = testTeams.findIndex((testTeam) => testTeam.id === teamModule.teamId);
        if (teamIndex > -1) {
          let team = testTeams[teamIndex];
          
          const foundModuleIndex = readonlyModules.findIndex((moduleItem) => moduleItem.id === teamModule.moduleId);

          if (foundModuleIndex > -1) {
            const foundModule = readonlyModules[foundModuleIndex];
            // console.log(foundModule);
           
            team.modules.push(foundModule);
          }

          testTeams[teamIndex] = team;
        }
      }

      // front
      const frontModules = testTeamModules.filter((p) => p.teamId === 2).sort((a, b) => a.ordinal - b.ordinal);

      for (let index = 0; index < frontModules.length; index++) {
        const teamModule = frontModules[index];
        
        const teamIndex = testTeams.findIndex((testTeam) => testTeam.id === teamModule.teamId);
        if (teamIndex > -1) {
          let team = testTeams[teamIndex];
          
          const foundModuleIndex = readonlyModules.findIndex((moduleItem) => moduleItem.id === teamModule.moduleId);

          if (foundModuleIndex > -1) {
            const foundModule = readonlyModules[foundModuleIndex];
            // console.log(foundModule);
           
            team.modules.push(foundModule);
          }

          testTeams[teamIndex] = team;
        }
      }

    });
    console.log(testTeams);

    });

    

  });
  
  function test(event) {
    console.log(event);
    console.log(testTeams);

    const updateRequest = [];
    // go through and find the each of the modules to update the index
    for (let i = 0; i < testTeams.length; i++) {
      const testTeam = testTeams[i];
      
      // update the ordinal
      for (let j = 0; j < testTeam.modules.length; j++) {
        const element = testTeam.modules[j];

        const ttm = testTeamModules.filter((p)=> p.moduleId === element.id && p.teamId === testTeam.id);

        if (ttm.length === 1) {

          academyProgramPlanContext.updateModules(ttm[0].id, j);
        }
        
      }
    }

    Promise.all(updateRequest);
  }
</script>

<main>
  <div class="teams">
    {#each testTeams as team, index}
    <div class="role">{team.name}
      <div class="modules">
        <DragDropList on:dragEnd={test} bind:data={team.modules}/>
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
  }

  .teams {
    margin: auto;
    padding: 20px;
    display: grid;
    // grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 10px;
    
    .role {
      width: fit-content;
      margin: 0 10px 0 10px;
    }
  }
  
  .modules {
    margin: auto;
    padding: 20px;
    max-width: 900px;

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
</style>
