/**
 * Created by Hiren on 11-06-2017.
 */

export const CohortTabConstants = {
  SITE: 'site',
  SPORT: 'sport',
  CATEGORY: 'category',
  SIZE: 'size',
  FEE: 'fee',
  SLATE: 'slate',
  YEAR: 'year',
  MONTH: 'month',
  WEEKDAY: 'weekday'
};

export const CohortTabs:{value:string,label:string}[] = [
  {value: CohortTabConstants.SITE, label: 'SITE'},
  {value: CohortTabConstants.SPORT, label: 'SPORT'},
  {value: CohortTabConstants.SIZE, label: 'SIZE'},
  {value: CohortTabConstants.FEE, label: 'FEE'},
  {value: CohortTabConstants.YEAR, label: 'YEAR'},
  {value: CohortTabConstants.MONTH, label: 'MONTH'},
  {value: CohortTabConstants.WEEKDAY, label: 'WEEKDAY'}
];

export const ContestTabConstants = {
  CONTESTS: 'contest',
  ENTRIES: 'entry'
};

export const ContestTabs:{value:string,label:string}[] = [
  {value: ContestTabConstants.CONTESTS, label: 'CONTESTS'},
  {value: ContestTabConstants.ENTRIES, label: 'ENTRIES'}
];

export const GraphTabConstants = {
  PROFIT: 'profit',
  SITE: 'site',
  SPORT: 'sport',
  CATEGORY: 'category'
};

export const GraphTabs:{value:string,label:string}[] = [
  {value: GraphTabConstants.PROFIT, label: 'PROFIT'},
  {value: GraphTabConstants.SITE, label: 'BY SITE'},
  {value: GraphTabConstants.SPORT, label: 'BY SPORT'}
];
