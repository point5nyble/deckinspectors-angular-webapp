import {Injectable, Injector, Type} from "@angular/core";
import {ProjectUpdateStateSubject} from "./project-update-state-subject";
import {ApplicationStateChangeSubject} from "./application-state-change-subject";
import {ShowProjectDetailsSubject} from "./show-project-details-subject";
import {LocationClickSubject} from "./location-click-subject";

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
  }
}
