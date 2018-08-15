import { Component, OnInit, AfterViewInit } from "@angular/core";
import { NewsTabs, NewsTabConstants } from "../../constants/menu.constants";
import { Router, ActivatedRoute } from "@angular/router";
import { FrontService } from "../../services/front.service";
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'
// import {News} from "../../models/news.model";
/**
 * Created by Hiren on 28-06-2017.
 */

@Component({
  selector: 'rp-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, AfterViewInit {

  PRIORITY_ALL: number = 0;
  PRIORITY_URGENT: number = 1;
  PRIORITY_VERY_URGENT: number = 2;
  PRIORITY_IMPORTANT: number = 3;
  PRIORITY_VERY_IMPORTANT: number = 4;
  PRIORITY_NOTE_WORTHY: number = 5;
  currentPage: number;
  videoRecords: any = [];
  liveRecords: any = [];
  isLoading: boolean;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private videoService: FrontService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.getData();
  }

  ngAfterViewInit() {
    // viewChild is set after the view has been initialized
  }

  // onNewsTabChanged(tabName:{value:string,label:string}) {
  //   this.activeTab = tabName.value;
  //   this.router.navigate(['/news'], {queryParams: {tab: tabName.value}})
  // }
  //
  // onNewsPriorityChanged(priority:number) {
  //   this.filterNews(priority);
  // }


  // filterNews(priority:number) {
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

  getData() {
    this.isLoading = true;
    let that = this;
    this.videoService.retrieveVideos().subscribe(
      response => {
        if (response.statusCode == 200) {
          let data: Array<any> = response.data;



          this.videoRecords = data.map(currData => {
            // console.log(currData.id);
            // console.log(currData.snippet.title);

            let dangerousVideoUrl = '//www.youtube.com/embed/' + currData.id + '?rel=0&modestbranding=1&controls=1&showinfo=0';
            currData.url = that.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
            currData.title = currData.snippet.title;
            return currData;
          });

          // this.videoRecords = that.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);

          console.log("records => ", this.videoRecords);
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

    this.videoService.retrieveVideos(true).subscribe(
      response => {
        if (response.statusCode == 200) {
          let data: Array<any> = response.data;

          this.liveRecords = data.map(currData => {
            // console.log(currData.id);
            // console.log(currData.snippet.title);

            let dangerousVideoUrl = '//www.youtube.com/embed/' + currData.id + '?rel=0&modestbranding=1&controls=1&showinfo=0';
            currData.url = that.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
            currData.title = currData.snippet.title;
            return currData;
          });

          // this.videoRecords = that.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);

          console.log("records => ", this.liveRecords);
        } else {
          console.log('response error => ', response);
        }
        // this.isLoading = false;
      },
      error => {
        // this.isLoading = false;
        console.log('http error => ', error);
      }
    )
  }

}
