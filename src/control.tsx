import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { IconButton, DefaultButton } from "office-ui-fabric-react/lib/components/Button";
import { Label } from 'office-ui-fabric-react/lib/Label';

initializeIcons();

export class Control {

  public readonly fieldNameVoters = VSS.getConfiguration().witInputs.Voters;
  public readonly fieldNameVotes = VSS.getConfiguration().witInputs.Votes;
  private readonly _container = document.getElementById("container") as HTMLElement;

  constructor() {  
  }

  public async refresh() : Promise<void> {

    let upvoteTooltip : string = await this._getVotersList();
    upvoteTooltip = `Upvote.\n\nVoters:\n${upvoteTooltip}`;

    ReactDOM.render(
      <div style={{ padding: "3px" }} id="wrapper" className="wrapper">
        <Label>Votes</Label>
        <Label style={{ display: "inline", fontSize: "21px" }}>{(await this._getVoters()).length}</Label>
        <IconButton
          iconProps={{ iconName: 'Like' }}
          title={upvoteTooltip}
          onClick={async () => { await this._onLikeClickedAsync(); }} />
        <IconButton
          iconProps={{ iconName: 'Dislike' }}
          title='Downvote.'
          onClick={async () => { await this._onDislikeClickedAsync(); }} />
      </div>
      ,
      this._container,
      () => {
        this._resize();
      });
  }

  private _resize() {
    let wrapper = document.getElementById("wrapper") as HTMLElement;
    console.debug(wrapper.offsetHeight);
    VSS.resize(wrapper.offsetWidth, wrapper.offsetHeight);  
  }

  private async _getVoters() : Promise<string[]> {
    const formService = await WorkItemFormService.getService();
    const value = await formService.getFieldValue(this.fieldNameVoters);

    if (typeof value !== "string")
      return [];

    return value.split(";").filter(v => !!v);
  }

  // private async _getVotersFragment() : Promise<JSX.Element> {
  //   let voters = await this._getVoters();
  //   return (
  //     <div className="App">
  //       {voters.map(t => <div>{t}</div>)}
  //     </div>
  //   )
  // }

  private async _getVotersList() : Promise<string> {
    const formService = await WorkItemFormService.getService();
    const value = await formService.getFieldValue(this.fieldNameVoters) as string;
    return value.replace(/\;/g, '\n');    
  }

  private async _setVoters(values: string[]) : Promise<void> {
    const formService = await WorkItemFormService.getService();

    await formService.setFieldValue(this.fieldNameVoters, values.sort().join(";"));
  }

  private async _setVotes(value : number) {
    const formService = await WorkItemFormService.getService();
    await formService.setFieldValue(this.fieldNameVotes, value);
  }

  private async _onLikeClickedAsync() : Promise<void> {

    let userEmail = VSS.getWebContext().user.email;
    let voters = await this._getVoters();
    let index = voters.findIndex(t => t.toLowerCase() === userEmail.toLowerCase());
    if (index < 0) {
      voters.push(userEmail);
      await this._setVoters(voters);
      await this._setVotes(voters.length);
    }
  }

  private async _onDislikeClickedAsync() : Promise<void> {

    let userEmail = VSS.getWebContext().user.email;
    let voters = await this._getVoters(); 
    let index = voters.findIndex(t => t.toLowerCase() === userEmail.toLowerCase());
    if (index > -1) {
      voters.splice(index, 1);    
      await this._setVoters(voters);  
      await this._setVotes(voters.length);
    }
  }
}
