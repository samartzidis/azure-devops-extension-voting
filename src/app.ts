/// <reference types="vss-web-extension-sdk" />

import * as WitExtensionContracts from "TFS/WorkItemTracking/ExtensionContracts";
import { Control } from "./control";


let control: Control;

const provider = () => {
  return {
    // Called when a new work item is being loaded in the UI
    onLoaded: (args: WitExtensionContracts.IWorkItemLoadedArgs) => {
      if (!control) 
        control = new Control();
      
      control.refresh();
    },
    // Called when the active work item is modified
    onFieldChanged: (args: WitExtensionContracts.IWorkItemFieldChangedArgs) => {
      if (control && args.changedFields[control.fieldNameVoters] !== undefined && args.changedFields[control.fieldNameVoters] !== null) {
        control.refresh();
      }
    },
    // Called when the active work item is being unloaded in the UI
    onUnloaded: (args: WitExtensionContracts.IWorkItemFieldChangedArgs) => {
    },
    // Called after the work item has been saved
    onSaved: (args: WitExtensionContracts.IWorkItemFieldChangedArgs) => {
    },
    // Called when the work item is reset to its unmodified state (undo)
    onReset: (args: WitExtensionContracts.IWorkItemFieldChangedArgs) => {
    },
    // Called when the work item has been refreshed from the server
    onRefreshed: (args: WitExtensionContracts.IWorkItemFieldChangedArgs) => {
      if (control && args.changedFields[control.fieldNameVoters] !== undefined && args.changedFields[control.fieldNameVoters] !== null) {
        control.refresh();
      }
    }
  };
};

VSS.register(VSS.getContribution().id, provider);
