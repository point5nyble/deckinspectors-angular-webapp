import {Injectable, Injector, Type} from "@angular/core";
import {ProjectUpdateStateSubject} from "./project-update-state-subject";
import {ApplicationStateChangeSubject} from "./application-state-change-subject";
import {ShowProjectDetailsSubject} from "./show-project-details-subject";
 import {PreviousButtonClickSubject} from "./previous-button-click-subject";
 import {FetchLeftTreeDataStateSubject} from "./fetch-left-tree-data-state-subject";
import {AddElementToPreviousButtonLogicSubject} from "./add-element-to-previous-button-logic-subject";
import {RemoveElementToPreviousButtonLogicSubject} from "./remove-element-to-previous-button-logic-subject";
import {UpdateLeftTreeDataSubject} from "./update-left-tree-data-subject";
import {SectionClickedSubject} from "./section-clicked-subject";
import {InvasiveButtonClickSubject} from "./invasive-button-click-subject";

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
    this.injector.get<PreviousButtonClickSubject>(
      PreviousButtonClickSubject as Type<PreviousButtonClickSubject>
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
    this.injector.get<UpdateLeftTreeDataSubject>(
      UpdateLeftTreeDataSubject as Type<UpdateLeftTreeDataSubject>
    )
    this.injector.get<SectionClickedSubject>(
      SectionClickedSubject as Type<SectionClickedSubject>
    )
    this.injector.get<InvasiveButtonClickSubject>(
        InvasiveButtonClickSubject as Type<InvasiveButtonClickSubject>
      )
  }
}
