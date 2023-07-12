import {Injectable, Injector, Type} from "@angular/core";
import {ProjectUpdateStateSubject} from "./project-update-state-subject";
import {ApplicationStateChangeSubject} from "./application-state-change-subject";
import {ShowProjectDetailsSubject} from "./show-project-details-subject";
import {LocationClickSubject} from "./location-click-subject";
import {PreviousButtonClickSubject} from "./previous-button-click-subject";
import {ShowAllProjectSubject} from "./show-all-project-subject";
import {FetchLeftTreeDataStateSubject} from "./fetch-left-tree-data-state-subject";
import {AddElementToPreviousButtonLogicSubject} from "./add-element-to-previous-button-logic-subject";
import {RemoveElementToPreviousButtonLogicSubject} from "./remove-element-to-previous-button-logic-subject";

@Injectable()
export class SubjectInjector {
  constructor(private injector: Injector) {
     this.injectSubject();
  }

  private injectSubject() {
    this.injector.get<ProjectUpdateStateSubject>(
      ProjectUpdateStateSubject as Type<ProjectUpdateStateSubject>
    )
    this.injector.get<ApplicationStateChangeSubject>(
      ApplicationStateChangeSubject as Type<ApplicationStateChangeSubject>
    )
    this.injector.get<ShowProjectDetailsSubject>(
      ShowProjectDetailsSubject as Type<ShowProjectDetailsSubject>
    )
    this.injector.get<LocationClickSubject>(
      LocationClickSubject as Type<LocationClickSubject>
      )
    this.injector.get<PreviousButtonClickSubject>(
      PreviousButtonClickSubject as Type<PreviousButtonClickSubject>
    )
    this.injector.get<ShowAllProjectSubject>(
      ShowAllProjectSubject as Type<ShowAllProjectSubject>
    )
    this.injector.get<FetchLeftTreeDataStateSubject>(
      FetchLeftTreeDataStateSubject as Type<FetchLeftTreeDataStateSubject>
    )
    this.injector.get<AddElementToPreviousButtonLogicSubject>(
      AddElementToPreviousButtonLogicSubject as Type<AddElementToPreviousButtonLogicSubject>
    )
    this.injector.get<RemoveElementToPreviousButtonLogicSubject>(
      RemoveElementToPreviousButtonLogicSubject as Type<RemoveElementToPreviousButtonLogicSubject>
    )

  }
}
