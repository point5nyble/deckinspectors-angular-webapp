import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {BackNavigation} from "../../../app-state-service/back-navigation-state/back-navigation-selector";

@Component({
  selector: 'app-navigation-component',
  templateUrl: './navigation-component.component.html',
  styleUrls: ['./navigation-component.component.scss']
})
export class NavigationComponentComponent implements OnInit{
  path!:any[];
  constructor(private store: Store<any>) {
  }
  ngOnInit(): void {
    this.store.select(BackNavigation.getPreviousStateModelChain).subscribe(res => this.path = res.stack);
  }

}
