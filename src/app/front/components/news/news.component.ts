import {Component} from "@angular/core";
import {NewsTabs, NewsTabConstants} from "../../constants/menu.constants";
import {Router, ActivatedRoute} from "@angular/router";
import {FrontService} from "../../services/front.service";
import {News} from "../../models/news.model";
/**
 * Created by Hiren on 28-06-2017.
 */

@Component({
  selector: 'rp-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {

  PRIORITY_ALL:number = 0;
  PRIORITY_URGENT:number = 1;
  PRIORITY_VERY_URGENT:number = 2;
  PRIORITY_IMPORTANT:number = 3;
  PRIORITY_VERY_IMPORTANT:number = 4;
  PRIORITY_NOTE_WORTHY:number = 5;

  newsTabs = NewsTabs;
  newsTabConstants = NewsTabConstants;
  currentPage:number;
  activeTab:string = this.newsTabConstants.NBA;
  newsPriority:number = 0;
  allNewsRecords:News[] = [];
  newsRecords:News[] = [];
  isLoading:boolean;

  constructor(private router:Router, private activeRoute:ActivatedRoute, private newsService:FrontService) {
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(
      params => {
        if (params.hasOwnProperty('tab')) {
          this.getData(params['tab']);
          this.activeTab = params['tab'];
        }
        else {
          this.router.navigate(['/news'], {queryParams: {tab: this.activeTab}})
        }
      }
    )
  }

  onNewsTabChanged(tabName:{value:string,label:string}) {
    this.activeTab = tabName.value;
    this.router.navigate(['/news'], {queryParams: {tab: tabName.value}})
  }

  onNewsPriorityChanged(priority:number) {
    this.filterNews(priority);
  }


  filterNews(priority:number) {
    switch (priority) {
      case this.PRIORITY_ALL:
        this.newsRecords = this.allNewsRecords;
        break;
      case this.PRIORITY_URGENT:
      case this.PRIORITY_VERY_URGENT:
        this.newsRecords = this.allNewsRecords.filter(currNews => {
          if (currNews.news_priority == this.PRIORITY_URGENT || currNews.news_priority == this.PRIORITY_VERY_URGENT) {
            return true;
          }
        });
        break;
      case this.PRIORITY_IMPORTANT:
      case this.PRIORITY_VERY_IMPORTANT:
        this.newsRecords = this.allNewsRecords.filter(currNews => {
          if (currNews.news_priority == this.PRIORITY_IMPORTANT || currNews.news_priority == this.PRIORITY_VERY_IMPORTANT) {
            return true;
          }
        });
        break;
      default:
        this.newsRecords = this.allNewsRecords;
    }
  }

  getData(tabName:string) {
    this.isLoading = true;
    this.newsService.retrieveNews(tabName)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            let data:Array<any> = response.data;
            this.allNewsRecords = data.map(currData => currData['news'][0]);
            this.filterNews(this.newsPriority);
            console.log("records => ", this.newsRecords);
          } else {
            console.log('response error => ', response);
          }
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          console.log('http error => ', error);
        }
      )
  }

}
