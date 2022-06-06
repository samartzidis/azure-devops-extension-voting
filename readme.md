# Work Item Voting Extension for Azure DevOps

![Logo](img/logo.png)

[[GitHub]](https://github.com/samartzidis/azure-devops-extension-voting)

This simple **Azure DevOps** extension adds voting 👍 and 👎 (to remove your vote) buttons to a work item and maintains a votes counter. Hovering over the 👍 button, shows the current list of voters.

The extension requires the creation of two Work Item custom fields for its backing store:
- One of type **Text** to internally maintain the list of unique voters.
- One of type **Integer** to maintain the total vote count.

To add the custom fields to your Azure DevOps project process, go to _Organization Settings_ -> _Boards_ -> _Process_ -> _All processes_ -> _Fields_. Add the two fields described above.

To then add the Voting Extension on a particular type of Work Item, go to _Organization Settings_ -> _Boards_ -> _Process_ -> _All processes_, open the Process Work Item that you would like to add voting to and select _Add custom control_. You can then choose the Voting control from the list of available controls and configure it under its _Options_ tab.
