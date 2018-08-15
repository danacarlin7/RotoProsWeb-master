import {Component} from "@angular/core";
import {NewsTabs, NewsTabConstants} from "../../constants/menu.constants";
import {Router, ActivatedRoute} from "@angular/router";
import {FrontService} from "../../services/front.service";
import {Injuries} from "../../models/injuries.model";
/**
 * Created by Hiren on 28-06-2017.
 */

@Component({
  selector: 'rp-injuries',
  templateUrl: './injuries.component.html',
  styleUrls: ['./injuries.component.css']
})
export class InjuriesComponent {

  // PRIORITY_ALL:number = 0;
  // PRIORITY_URGENT:number = 1;
  // PRIORITY_VERY_URGENT:number = 2;
  // PRIORITY_IMPORTANT:number = 3;
  // PRIORITY_VERY_IMPORTANT:number = 4;
  // PRIORITY_NOTE_WORTHY:number = 5;

  newsTabs = NewsTabs;
  newsTabConstants = NewsTabConstants;
  currentPage: number;
  activeTab: string = this.newsTabConstants.NBA;
  // newsPriority:number = 0;
  allInjuriesRecords: Injuries[] = [];
  // injuriesRecords: Injuries[] = [];
  isLoading: boolean;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private injuriesService: FrontService) {
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(
      params => {
        if (params.hasOwnProperty('tab')) {
          this.getData(params['tab']);
          this.activeTab = params['tab'];
        }
        else {
          this.router.navigate(['/injuries'], {queryParams: {tab: this.activeTab}})
        }
      }
    );
  }

  onNewsTabChanged(tabName: { value: string, label: string }) {
    this.activeTab = tabName.value;
    this.router.navigate(['/injuries'], {queryParams: {tab: tabName.value}})
  }

  // onNewsPriorityChanged(priority:number) {
  //   this.filterInjuries(priority);
  // }


  // filterInjuries(priority:number) {
  //   switch (priority) {
  //     case this.PRIORITY_ALL:
  //       this.newsRecords = this.allNewsRecords;
  //       break;
  //     case this.PRIORITY_URGENT:
  //     case this.PRIORITY_VERY_URGENT:
  //       this.newsRecords = this.allNewsRecords.filter(currNews => {
  //         if (currNews.news_priority == this.PRIORITY_URGENT || currNews.news_priority == this.PRIORITY_VERY_URGENT) {
  //           return true;
  //         }
  //       });
  //       break;
  //     case this.PRIORITY_IMPORTANT:
  //     case this.PRIORITY_VERY_IMPORTANT:
  //       this.newsRecords = this.allNewsRecords.filter(currNews => {
  //         if (currNews.news_priority == this.PRIORITY_IMPORTANT || currNews.news_priority == this.PRIORITY_VERY_IMPORTANT) {
  //           return true;
  //         }
  //       });
  //       break;
  //     default:
  //       this.newsRecords = this.allNewsRecords;
  //   }
  // }

  getData(tabName: string) {
    this.isLoading = true;
    this.injuriesService.retrieveInjuries(tabName)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            let data: Array<any> = response.data;
            this.allInjuriesRecords = data.map(currData => currData['injuries'][0]);
            // this.filterNews(this.newsPriority);
            console.log("records => ", this.allInjuriesRecords);
          } else {
            console.log('response error => ', response);
          }
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          console.log('http error => ', error);
        }
      );
  }
}
