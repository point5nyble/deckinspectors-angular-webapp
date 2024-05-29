import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { HttpsRequestService } from 'src/app/service/https-request.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-move-sections-modal',
  templateUrl: './move-sections-modal.component.html',
  styleUrls: ['./move-sections-modal.component.scss']
})
export class MoveSectionsModalComponent {
  locationsList!: any[];
  sectionsList: any[] = [];
  dropTargetIds: any[] = [];
  isSaving: boolean = false;
  isDisplayed: boolean = true;
  projectName!: string;

  selectedParent!: any;
  constructor(private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<MoveSectionsModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any, private httpsRequestService:HttpsRequestService) {
                this.locationsList = data.locationsList;
                this.projectName = data.projectName;
   }

   ngOnInit(){
    console.log(this.locationsList);

    this.locationsList.forEach((location: any) => {
      this.dropTargetIds.push(location[0].locationId);
    })
   }


   drop = (event: any) =>{
    this.isDisplayed = false;
    let movedSection = event.previousContainer.data[event.previousIndex];
    let newParent = event.container.data[0];
    if (!(movedSection && newParent) || (event.container === event.previousContainer)){
      this.isDisplayed = true;
      return;
    }
    let url = `${environment.apiURL}/section/moveSection`;

    let data = {
      newParentId: newParent.locationId,
      sectionId: movedSection._id
  };
  this.sectionsList = [];
  this.httpsRequestService.postHttpData(url, data).subscribe(
      (response:any) => {
        this.fetchChildren(this.selectedParent);
      },
      error => {
          alert('Error moving location');
          this.isDisplayed = true;
      }
  );
   }

   fetchChildren = (locationId: string) =>{
    let url = environment.apiURL + '/location/getLocationById';
    let data = {
        locationid:locationId,
        username: localStorage.getItem('username')
    };
    this.isDisplayed = false;
    this.selectedParent = locationId;
    this.httpsRequestService.postHttpData(url, data).subscribe(
        (response:any) => {
          this.sectionsList = response.location.sections;
          this.isDisplayed = true;
        },
        error => {
            alert('Error loading children');
            this.isDisplayed = true;
        }
    );
   }

  close() {
    this.dialogRef.close();
  }
}
