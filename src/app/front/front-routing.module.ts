import {NgModule} from "@angular/core";
import {RouterModule, Routes, Route} from "@angular/router";
import {FrontMainComponent} from "./front-main.component";
import {FrontHomeComponent} from "./components/home/front-home.component";
import {LoginComponent} from "./components/login/login.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {NewsComponent} from "./components/news/news.component";
import {TestComponent} from "./components/test/test.component";
import {ProviderLineupComponent} from "./components/provider-lineup/provider-lineup.component";
import {DailyLineupComponent} from "./components/daily-lineup/daily-lineup.component";
import {ArticlesComponent} from "./components/articles/articles.component";
import {LineupOptimizerComponent} from "./components/lineup-optimizer/lineup-optimizer.component";
import {AuthGuard} from "../shared/services/auth.guard";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {DFSBasicsComponent} from "./components/dfs-basics/dfs-basics.component";
import {ExcelToolComponent} from "./components/excel-tool/excel-tool.component";
import {FAQComponent} from "./components/faq/faq.component";

import {ProviderComponent} from "./components/provider/provider.component";
import {ProviderPublicComponent} from "./components/provider-public/public.component";

import {InjuriesComponent} from "./components/injuries/injuries.component";
import {ChangePasswordComponent} from "./components/change-password/change-password.component";
import {ArticleComponent} from "./components/article/article.component";
import {GeneratedLineupsComponent} from "./components/lineup-optimizer/generated-lineups/generated-lineups.component";
import {SubscribeComponent} from "./components/subscribe/subscribe.component";
import {VerifyAccComponent} from "./components/forgot-password/verify-acc.component";
import {MarketPlaceComponent} from "./components/market-place/market-place.component";
import {ExtensionsComponent} from "./components/extensions/extensions.component";
import {NFLLineupOptimizerComponent} from "./components/nfl-lineup-optimizer/nfl-lineup-optimizer.component";
import {SubscriptionGuard} from "../shared/services/subscription.guard";
import {SubscriptionNewGuard} from "../shared/services/subscription-new.guard";

import {ContactAnalyzerComponent} from "./components/contact-analyzer/contact-analyzer.component";
import {GeneratedNFLLineupsComponent} from "./components/nfl-lineup-optimizer/generated-nfl-lineups/generated-nfl-lineups.component";
import {NFLExcelToolComponent} from "./components/excel-tool-nfl/nfl-excel-tool.component";
import {NBALineupOptimizerComponent} from "./components/nba-lineup-optimizer/nba-lineup-optimizer.component";
import {GeneratedNBALineupsComponent} from "./components/nba-lineup-optimizer/generated-nba-linups/generated-nba-lineups.component";
import { PodcastComponent } from './components/podcast/podcast.component';
import {PlanComponent} from "./components/plan/plan.component";
import {VideoComponent} from "./components/video/video.component";
import {FreeOfferComponent} from "./components/free-offer/free-offer.component";


/**
 * Created by Hiren on 05-06-2017.
 */
const routes: Routes = [
  {
    path: "",
    component: FrontMainComponent,
    data: {title: "RotoPose - Home"},
    children: [
      { path: "", component: FrontHomeComponent },
      { path: "homeRedirect", component: FrontHomeComponent },
      { path: "verify", component: VerifyAccComponent },
      { path: ":token/verify", component: VerifyAccComponent },
      { path: ":token/change-password", component: ChangePasswordComponent },
      { path: "login", component: LoginComponent },
      { path: "signup", component: SignUpComponent },
      { path: "forgot-password", component: ForgotPasswordComponent },
      { path: "provider-lineup", canActivate: [AuthGuard], component: ProviderLineupComponent },
      { path: "news", component: NewsComponent },
      { path: "market-place", component: MarketPlaceComponent },
      { path: "extensions", component: ExtensionsComponent },
      { path: "lineups", component: DailyLineupComponent },
      { path: "articles/:id", canActivate: [SubscriptionNewGuard],component: ArticleComponent },
      { path: "articles", component: ArticlesComponent },
      { path: "basics", component: DFSBasicsComponent },
      { path: "mlb-excel-tool", component: ExcelToolComponent },
      { path: "nfl-excel-tool", component: NFLExcelToolComponent },
      { path: "faq", component: FAQComponent },
      { path: "provider-lineups", canActivate: [AuthGuard], component: ProviderComponent},
      { path: "provider-public-lineups", component: ProviderPublicComponent},
      { path: "lineup-optimizer", canActivate: [SubscriptionGuard], component: LineupOptimizerComponent },
      { path: "lineup-optimizer/mlb", canActivate: [SubscriptionGuard], component: LineupOptimizerComponent },
      { path: "lineup-optimizer/nfl", canActivate: [SubscriptionGuard], component: NFLLineupOptimizerComponent },
      // { path: "lineup-optimizer/nba", canActivate: [SubscriptionGuard], component: NBALineupOptimizerComponent },
      { path: "mlb-lineups", component: GeneratedLineupsComponent },
      { path: "nfl-lineups", component: GeneratedNFLLineupsComponent },
      { path: "nba-lineups", component: GeneratedNBALineupsComponent },
      { path: "injuries", component: InjuriesComponent },
      { path: "subscribe", component: SubscribeComponent },
      { path: "plans", component: PlanComponent },
      { path: "videos", component: VideoComponent },
      { path: "contact-analyzer", component: ContactAnalyzerComponent },
      { path: "podcast", component: PodcastComponent },
      {path: "FreeOffer", component: FreeOfferComponent},
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class FrontRoutingModule {

}
