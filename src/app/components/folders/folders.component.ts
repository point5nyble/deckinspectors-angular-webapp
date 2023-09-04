import { Component, OnInit } from '@angular/core';
import { Folder } from '../../common/models/folder';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss']
})
export class FoldersComponent  implements OnInit
{
  folders!: Folder[];
  showChildren: any = {};
  showSubChildren: any = {};
  showFolderMenu: any = {};
  isAddClicked: boolean = false;
  newFolder: string = "";
  ngOnInit(): void {
    this.folders = [{_id: "1", name: "test1", children: [{_id: "3", name: "s1", children:[{name: "c1"}, {name: "c2"}, {name: "c3"}, ]}, {_id: "4", name: "s2", children:[{name: "c1"}, {name: "c2"}, {name: "c3"},]}, {_id: "5", name: "s3"}, {_id: "6", name: "s4"}, ]}, {_id: "2", name: "test2", children: [{_id: "9", name: "s1"}, {_id: "8", name: "s2", children:[{name: "c1"}, {name: "c2"}, {name: "c3"},]}]}];
    this.folders.forEach(folder=> {
      this.showChildren[folder._id] = false;
      this.showFolderMenu[folder._id] = false;
      folder.children.forEach(child=> {
        this.showSubChildren[child._id] = false;
        this.showFolderMenu[child._id] = false;
      });
    });
  }

  addClicked = () =>{
    if(!this.isAddClicked){
      this.isAddClicked = true;
    }
  }

  subFolderMenu = (id: string) =>{
    this.removeFolderMenu();
    this.showFolderMenu[id] = true;
    return false;
  }

  addFolder = () =>{
    if(this.newFolder.trim() !== ""){
      console.log("creating " + this.newFolder);
      this.folders.push({_id: "", name: this.newFolder, children: []})
      this.removeNewFolder();
    }
  }

  removeNewFolder = () =>{
    this.newFolder = "";
    this.isAddClicked = false;
  }

  removeFolderMenu = () =>{
    Object.keys(this.showFolderMenu).forEach(key=>this.showFolderMenu[key] = false);
  }
  expandFolder = (id: string)=>{
    this.showChildren[id]= !this.showChildren[id];
  }

  expandSubFolder = (id: string)=>{
    this.showSubChildren[id]= !this.showSubChildren[id];
  }

  handleClick = () =>{
    this.removeFolderMenu();
  }

  addSubFolder = () =>{

  }
}
