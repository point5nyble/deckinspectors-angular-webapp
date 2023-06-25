import {Injectable, Injector, Type} from "@angular/core";
import {ProjectUpdateStateSubject} from "./project-update-state-subject";
import {ApplicationStateChangeSubject} from "./application-state-change-subject";

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
  }
}
