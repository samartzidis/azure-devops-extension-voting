import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { IconButton, DefaultButton } from "office-ui-fabric-react/lib/components/Button";
import { Label } from 'office-ui-fabric-react/lib/Label';

type Voters = [string[], string[]];

initializeIcons();

export class Control {

  public readonly fieldNameVoters = VSS.getConfiguration().witInputs.Voters;
  public readonly fieldNameVotes = VSS.getConfiguration().witInputs.Votes;
  private readonly _container = document.getElementById("container") as HTMLElement;  

  constructor() {  
  }

  public async refresh() : Promise<void> {

    let voters = await this._getVoters();
    let votes = voters[0].length - voters[1].length;

    let upTooltup = `Vote Up.\n\n${voters[0].join("\n")}`
    let downTooltup = `Vote Down.\n\n${voters[1].join("\n")}`
    
    ReactDOM.render(
      <div id="wrapper" className="wrapper">        
        
        <Label>Votes</Label>
        <Label style={{ display: "inline", fontSize: "21px", padding: '0px 10px 0px 10px' }}>{votes}</Label>

        <IconButton style={{ pointerEvents: 'all' }}
          iconProps={{ iconName: 'Like' }}
          title={upTooltup}
          disabled={!this._canVoteUp(voters)}
          onClick={async () => await this._onVoteUpClickedAsync()} />

        <IconButton style={{ pointerEvents: 'all' }}
          iconProps={{ iconName: 'Dislike' }}
          title={downTooltup}
          disabled={!this._canVoteDown(voters)}
          onClick={async () => await this._onVoteDownClickedAsync()} />
      </div>
      ,
      this._container,
      () => {
        this._resize();
      });
  }

  private _resize() {
    let wrapper = document.getElementById("wrapper") as HTMLElement;
    //console.debug(wrapper.offsetHeight);
    VSS.resize(wrapper.offsetWidth, wrapper.offsetHeight);  
  }

  private _canVoteUp(voters : Voters) : boolean {
    let userEmail = VSS.getWebContext().user.email;
    let index = voters[0].findIndex(t => t.toLowerCase() === userEmail.toLowerCase());

    return index < 0;
  }

  private _canVoteDown(voters : Voters) : boolean {
    let userEmail = VSS.getWebContext().user.email;
    let index = voters[1].findIndex(t => t.toLowerCase() === userEmail.toLowerCase());

    return index < 0;
  }

  private async _getVoters() : Promise<Voters> {
    const formService = await WorkItemFormService.getService();
    const value = await formService.getFieldValue(this.fieldNameVoters);

    if (typeof value !== "string")
      return [[],[]];

    let values =  value.split(";").map(t => t.trim());
    let upVoters = values.filter(t => !t.startsWith('!')).filter(v => !!v);
    let downVoters = values.filter(t => t.startsWith('!')).map(t => t.substring(1)).filter(v => !!v);

    return [upVoters, downVoters];
  }

  private async _setVoters(voters : Voters) : Promise<void> {
    const formService = await WorkItemFormService.getService();

    let upVoters = voters[0].sort();
    let downVoters = voters[1].sort().map(t => `!${t}`);
    let votersString = upVoters.concat(downVoters).join(";");    

    await formService.setFieldValue(this.fieldNameVoters, votersString);

    let votes = voters[0].length - voters[1].length;
    await formService.setFieldValue(this.fieldNameVotes, votes);
  }

  private async _onVoteUpClickedAsync() : Promise<void> {
    let userEmail = VSS.getWebContext().user.email;
    let voters = await this._getVoters();

    let upVoters = voters[0];
    let downVoters = voters[1];
    let indexUpVoters = upVoters.findIndex(t => t.toLowerCase() === userEmail.toLowerCase());
    let indexDownVoters = downVoters.findIndex(t => t.toLowerCase() === userEmail.toLowerCase());

    if (indexDownVoters >= 0)
      downVoters.splice(indexDownVoters, 1);
    else if (indexUpVoters < 0)
      upVoters.push(userEmail);
    else
      return;

    await this._setVoters([upVoters, downVoters]);
  }

  private async _onVoteDownClickedAsync() : Promise<void> {
    let userEmail = VSS.getWebContext().user.email;
    let voters = await this._getVoters(); 

    let upVoters = voters[0];
    let downVoters = voters[1];
    let indexUpVoters = upVoters.findIndex(t => t.toLowerCase() === userEmail.toLowerCase());
    let indexDownVoters = downVoters.findIndex(t => t.toLowerCase() === userEmail.toLowerCase());

    if (indexUpVoters >= 0)
      upVoters.splice(indexUpVoters, 1);
    else if (indexDownVoters < 0)
      downVoters.push(userEmail);
    else 
      return;

    await this._setVoters([upVoters, downVoters]);
  }
}
