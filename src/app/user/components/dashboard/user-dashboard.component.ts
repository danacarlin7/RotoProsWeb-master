import {Component, ElementRef, ViewChild} from "@angular/core";
import {DashboardFilter} from "../../models/dashboard-filter.model";
import {UserContestData} from "../../models/user-contest-data.model";
import {ContestTopWin} from "../../models/contest";
import {UserDashboardServices} from "../../services/user-dashboard.service";
import * as moment from "moment";
import * as c3 from "c3";
/**
 * Created by Hiren on 11-06-2017.
 */

declare var jQuery:any;

@Component({
  selector: 'rp-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {

  dashboardFilter:DashboardFilter;
  staticsData:UserContestData;
  topWinData:ContestTopWin[];
  errorMsg:string = "";
  isLoading:boolean;
  loadingCounter:number = 0;

  @ViewChild('lineChart') lineChart:ElementRef;
  @ViewChild('bySiteChart') bySiteChart:ElementRef;
  @ViewChild('bySportChart') bySportChart:ElementRef;
  @ViewChild('byCategoryChart') byCategoryChart:ElementRef;
  @ViewChild('byDayOfWeekChart') byDayOfWeekChart:ElementRef;

  public lineChartData:Array<any>;
  public lineChartLabels:Array<any>;
  public lineChartType:string = 'line';

  constructor(private dashboardService:UserDashboardServices) {

  }

  ngOnInit() {
    this.updateDashboard();
  }

  updateDashboard(filterData:DashboardFilter = null) {
    this.isLoading = true;
    this.dashboardFilter = filterData;
    this.getContestTopWinData(this.dashboardFilter);
    this.getContestData(this.dashboardFilter);
    this.getChartData(this.dashboardFilter);
    this.getBreakdownChartData();
  }

  getContestData(data:DashboardFilter = null) {
    this.loadingCounter++;
    this.dashboardService.getContestReport(data)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.staticsData = UserContestData.getObject(response.data);
            console.log("staticsData => ", this.staticsData);
            this.loadingCounter--;
            if (this.loadingCounter == 0) {
              this.isLoading = false;
            }
          }
          else {

          }
        },
        error => {
          this.errorMsg = error.message;
        }
      )
  }

  getContestTopWinData(data:DashboardFilter = null) {
    this.loadingCounter++;
    this.dashboardService.getContestTopWinData(data)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.topWinData = response.data;
            console.log("topWinData => ", this.topWinData);
            this.loadingCounter--;
            if (this.loadingCounter == 0) {
              this.isLoading = false;
            }
          }
          else {

          }
        },
        error => {
          this.errorMsg = error.message;
          console.log("error => ", error);
        }
      )
  }

  getChartData(data:DashboardFilter = null) {
    this.isLoading = true;
    this.loadingCounter++;
    this.dashboardService.getProfitByDayOfWeek(data)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.lineChartData = response.data.datas;
            this.lineChartLabels = response.data.labels;
            this.loadingCounter--;
            if (this.loadingCounter == 0) {
              this.isLoading = false;
            }

            //draw chart
            let chart = c3.generate({
              bindto: this.lineChart.nativeElement,
              data: {
                columns: [
                  ['amount', ...this.lineChartData]
                ],
                types: {
                  amount: 'area-spline'
                },
                colors: {
                  'amount': '#ffc107'
                }
              },
              point: {
                show: false
              },
              axis: {
                x: {
                  type: 'category',
                  categories: [...this.lineChartLabels]
                },
                y: {
                  tick: {
                    format: (d) => {
                      return "$" + d;
                    }
                  }
                }
              }
            });
          }
          else {

          }
        },
        error => {
          console.log("error => ", error);
        }
      )
  }

  getBreakdownChartData(data:DashboardFilter = null) {
    this.dashboardService.getBreakdownChartData(data)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            console.log("breakDownData => ", response);
            let breakDownData = response.data;
            console.log("breakDownData => ", breakDownData);
            c3.generate({
              bindto: this.bySiteChart.nativeElement,
              size: {
                width: 170,
                height: 180
              },
              data: {
                columns: this.prepareBreakDownData(breakDownData.sites),
                type: 'donut'
              },
              donut: {
                width: 20,
                label: {
                  show: false
                }
              },
              legend: {
                show: false
              },
              tooltip: {
                format: {
                  value: (value, ratio, id) => {
                    return value;
                  }
                }
              }
            });
            c3.generate({
              bindto: this.bySportChart.nativeElement,
              size: {
                width: 170,
                height: 180
              },
              data: {
                columns: this.prepareBreakDownData(breakDownData.sports),
                type: 'donut'
              },
              donut: {
                width: 20,
                label: {
                  show: false
                }
              },
              legend: {
                show: false
              },
              tooltip: {
                format: {
                  value: (value, ratio, id) => {
                    return value;
                  }
                }
              }
            });
            /*c3.generate({
             bindto: this.byCategoryChart.nativeElement,
             size: {
             width: 160,
             height: 170
             },
             data: {
             columns: this.prepareBreakDownData(breakDownData.categories),
             type: 'donut'
             },
             donut: {
             width: 30,
             label: {
             show: false
             }
             },
             legend: {
             show: false
             },
             tooltip: {
             format: {
             value: (value, ratio, id) => {
             return value;
             }
             }
             }
             });*/
            c3.generate({
              bindto: this.byDayOfWeekChart.nativeElement,
              size: {
                width: 170,
                height: 180
              },
              data: {
                columns: this.prepareBreakDownData(breakDownData.weekdays),
                type: 'donut'
              },
              donut: {
                width: 20,
                label: {
                  show: false
                }
              },
              legend: {
                show: false
              },
              tooltip: {
                format: {
                  value: (value, ratio, id) => {
                    return value;
                  }
                }
              }
            });
          }
          else {

          }
        }
      )
  }

  prepareBreakDownData(chartData:any[]):any[] {
    let columns = [];
    chartData.forEach(data => {
      columns.push([data.group, data.contests]);
    });
    return columns;
  }

}
