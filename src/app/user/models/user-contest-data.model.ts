/**
 * Created by Hiren on 20-04-2017.
 */

export class UserContestData {
  entries:number;
  fees:number;
  averageScore:string;
  wins:number;
  net:number;
  roi:string;
  startDate:string;
  endDate:string;
  timePeriod:string;
  contest:number;

  static getObject(data:any):UserContestData {
    let contestData = new UserContestData();
    if (!data)
      return contestData;

    contestData.averageScore = data["average_score"];
    contestData.contest = data["contest"];
    contestData.endDate = data["end_date"];
    contestData.entries = data["entries"];
    contestData.net = data["net"];
    contestData.fees = data["fees"];
    contestData.roi = data["roi"];
    contestData.startDate = data["start_date"];
    contestData.timePeriod = data["time_period"];
    contestData.wins = data["wins"];

    return contestData;
  }
}
