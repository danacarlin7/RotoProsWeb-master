import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import * as c3 from "c3";
import * as moment from 'moment';
import {GraphData} from "../../models/graph-data.model";
import {GraphTabs, GraphTabConstants} from "../../constants/menu.constants";
import {FilterCriteria} from "../../models/filter-criteria.model";
import {FilterService} from "../../services/filter.service";
import {UserDashboardServices} from "../../services/user-dashboard.service";
/**
 * Created by Hiren on 17-06-2017.
 */

@Component({
  selector: 'rp-graphs',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {
  @ViewChild('chartAnchor') chartAnchor:ElementRef;

  graphData:GraphData;
  graphTabs = GraphTabs;
  graphTabConstants = GraphTabConstants;
  chartTitle:string = '';
  c3Chart:any;
  activeTab:string = this.graphTabConstants.PROFIT;

  filters:FilterCriteria[];
  filterSettings:any;
  isLoading:boolean;
  filterEventSubscription:any;

  constructor(private router:Router,
              private activatdRoute:ActivatedRoute,
              private dashboardService:UserDashboardServices,
              private filterService:FilterService,) {
    this.filterEventSubscription = this.filterService.filtersChangedEvent.subscribe(
      filters => {
        this.getData(this.filterService.activeGraphTab, filters);
        this.filters = filters;
      }
    );
    this.filters = this.filterService.filters;
    this.filterService.getFilterSettings()
      .subscribe(settings => {
        this.filterSettings = settings;
        console.log("filters => ", this.filterSettings);
      });
  }

  ngOnInit() {
    this.filterService.activeGraphTab = GraphTabConstants.PROFIT;
    this.activeTab = this.filterService.activeGraphTab;
    this.activatdRoute.queryParams.subscribe(
      params => {
        if (params.hasOwnProperty('tab')) {
          this.getData(params['tab'], this.filterService.filters);
          this.activeTab = this.filterService.activeGraphTab = params['tab'];
        }
        else {
          this.router.navigate(['/user/graphs'], {queryParams: {tab: this.activeTab}})
        }
      }
    )
  }

  getData(tabName, filters:FilterCriteria[] = null) {
    this.isLoading = true;
    this.dashboardService.retrieveGraphData(tabName, filters)
      .subscribe(
        data => {
          this.graphData = data.data;
          this.prepareChart();
          this.isLoading = false;
        }
      )
  }

  prepareChart() {
    switch (this.activeTab) {
      case this.graphTabConstants.PROFIT:
        this.prepareProfitChart();
        if (this.graphData.result && this.graphData.result[0].datas && this.graphData.result[0].datas.length)
          this.chartTitle = "PROFIT BY DAY ( $" + this.graphData.result[0].datas[this.graphData.result[0].datas.length - 1][1] + " Profit )";
        break;
      case this.graphTabConstants.SITE:
        this.prepareSiteChart();
        if (this.graphData.result && this.graphData.result[0].datas && this.graphData.result[0].datas.length)
          this.chartTitle = "PROFIT BY SITE ( $" + this.graphData.result[0].datas[this.graphData.result[0].datas.length - 1][1] + " Profit )";
        break;
      case this.graphTabConstants.SPORT:
        this.prepareSportChart();
        if (this.graphData.result && this.graphData.result[0].datas && this.graphData.result[0].datas.length)
          this.chartTitle = "PROFIT BY SPORT ( $" + this.graphData.result[0].datas[this.graphData.result[0].datas.length - 1][1] + " Profit )";
        break;
      case this.graphTabConstants.CATEGORY:
        this.prepareSportChart();
        break;
    }
  }

  prepareProfitChart() {
    this.c3Chart = c3.generate({
      bindto: this.chartAnchor.nativeElement,
      size: {
        height: 450
      },
      data: {
        x: 'x',
        columns: [
          ['profit/loss', ...this.prepareDataSeries(this.graphData.result[0].datas)],
          ['x', ...this.prepareXSeries(this.graphData.result[0].datas)]
        ],
        types: {
          'profit/loss': 'area-spline'
        },
        colors: {
          'profit/loss': '#ffc107'
        }
      },
      point: {
        show: false
      },
      subchart: {
        show: true
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            fit: true,
            format: (x) => {
              return moment(x).format('DD MMM')
            },
            count: 20,
          }
        },
        y: {
          tick: {
            format: (d) => {
              return (d > 999) ? (d / 1000) + 'K' : d + '';
            }
          }
        }
      },
      tooltip: {
        format: {
          title: (d) => {
            return moment(d).format('DD MMM, YYYY');
          },
          value: (value, ratio, id) => {
            return (value > 999) ? Math.round(value / 1000) + 'K' : value + '';
          }
        }
      },
      grid: {
        x: {
          show: false
        },
        y: {
          show: true,
          lines: [
            {value: this.graphData.high, class: 'gridMax', text: 'Max'},
            {value: this.graphData.low, class: 'gridMin', text: 'Min'}
          ]
        }
      }
    });
  }

  prepareSiteChart() {
    this.c3Chart = c3.generate({
      bindto: this.chartAnchor.nativeElement,
      size: {
        height: 450
      },
      data: {
        columns: []
      },
      point: {
        r: 1.5,
        focus: {
          expand: {
            enabled: true
          }
        }
      },
      subchart: {
        show: true
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            fit: true,
            format: (x) => {
              return moment(x).format('DD MMM')
            },
            count: 20,
          }
        },
        y: {
          tick: {
            format: (d) => {
              return (d > 999) ? (d / 1000) + 'K' : d + '';
            }
          }
        }
      },
      tooltip: {
        format: {
          title: (d) => {
            return moment(d).format('DD MMM, YYYY');
          },
          value: (value, ratio, id) => {
            return (value > 999) ? Math.round(value / 1000) + 'K' : value + '';
          }
        }
      },
      grid: {
        x: {
          show: false
        },
        y: {
          show: true
        }
      }
    });
    this.graphData.result.forEach(
      resultObj => {
        this.c3Chart.load({
          columns: [
            [resultObj.name, ...this.prepareDataSeries(resultObj.datas)],
            ['x_' + resultObj.name, ...this.prepareXSeries(resultObj.datas)]
          ],
          xs: {
            [resultObj.name]: 'x_' + resultObj.name
          },
          type: 'spline'
        })
      }
    );
  }

  prepareSportChart() {
    this.c3Chart = c3.generate({
      bindto: this.chartAnchor.nativeElement,
      size: {
        height: 450
      },
      data: {
        columns: []
      },
      point: {
        r: 1.5,
        focus: {
          expand: {
            enabled: true
          }
        }
      },
      subchart: {
        show: true
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            fit: true,
            format: (x) => {
              return moment(x).format('DD MMM')
            },
            count: 20,
          }
        },
        y: {
          tick: {
            format: (d) => {
              return (d > 999) ? (d / 1000) + 'K' : d + '';
            }
          }
        }
      },
      tooltip: {
        format: {
          title: (d) => {
            return moment(d).format('DD MMM, YYYY');
          },
          value: (value, ratio, id) => {
            return (value > 999) ? Math.round(value / 1000) + 'K' : value + '';
          }
        }
      },
      grid: {
        x: {
          show: false
        },
        y: {
          show: true
        }
      }
    });
    this.graphData.result.forEach(
      resultObj => {
        this.c3Chart.load({
          columns: [
            [resultObj.name, ...this.prepareDataSeries(resultObj.datas)],
            ['x_' + resultObj.name, ...this.prepareXSeries(resultObj.datas)]
          ],
          type: 'spline',
          xs: {
            [resultObj.name]: 'x_' + resultObj.name
          }
        })
      }
    );
  }

  prepareXSeries(results:Array<any>):Array<any> {
    let xSeries = [];
    results.forEach(result => {
      xSeries.push(result[0] * 1000);
    });
    return xSeries;
  }

  prepareDataSeries(results:Array<any>):Array<any> {
    let dataSeries = [];
    results.forEach(result => {
      dataSeries.push(result[1]);
    });
    return dataSeries;
  }

  onGraphTabChanged(tabName:{value:string,label:string}) {
    this.activeTab = tabName.value;
    this.router.navigate(['/user/graphs'], {queryParams: {tab: tabName.value}})
  }

  onAddFilterEventHandler(filter:FilterCriteria) {
    this.filterService.addFilter(filter);
  }

  onRemoveFilterEvent(filter:FilterCriteria) {
    this.filterService.removeFilter(filter);
  }

  onRemoveAllFiltersEvent(filters:FilterCriteria[]) {
    this.filterService.clearFilter();
  }

  ngOnDestroy() {
    this.filterEventSubscription.unsubscribe();
  }
}
