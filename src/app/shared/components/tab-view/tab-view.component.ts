import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 * Created by Hiren on 29-04-2017.
 */

@Component({
  selector: 'rp-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.css']
})
export class TabViewComponent {

  @Input() activeTab:string;

  private _tabs:{value:string,label:string}[];

  get tabs():{value:string,label:string}[] {
    return this._tabs;
  }

  @Input() set tabs(value:{value:string,label:string}[]) {
    this._tabs = value;
  }

  @Output() tabChanged:EventEmitter<{value:string,label:string}> = new EventEmitter<{value:string,label:string}>();

  onCohortTabChanged(tabName:{value:string,label:string}) {
    this.tabChanged.emit(tabName);
  }

}
