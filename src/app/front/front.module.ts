import {NgModel} from "@angular/forms/forms";
import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {FrontMainComponent} from "./front-main.component";
import {FrontRoutingModule} from "./front-routing.module";
import {FrontFooterComponent} from "./components/footer/front-footer.component";
import {FrontHeaderComponent} from "./components/header/front-header.component";
import {FrontHomeComponent} from "./components/home/front-home.component";
import {LoginComponent} from "./components/login/login.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {FrontService} from "./services/front.service";
import {NewsComponent} from "./components/news/news.component";
import {TestComponent} from "./components/test/test.component";
import {ProviderLineupComponent} from "./components/provider-lineup/provider-lineup.component";
import {ArticlesComponent} from "./components/articles/articles.component";
import {DailyLineupComponent} from "./components/daily-lineup/daily-lineup.component";
import {LineupOptimizerComponent} from "./components/lineup-optimizer/lineup-optimizer.component";
import {ArticleService} from "./services/article.service";
import {ArticleComponent} from "./components/article/article.component";
import {InfiniteScrollModule} from "angular2-infinite-scroll/angular2-infinite-scroll";
import {LineupOptimizerService} from "./services/lineup-optimizer.service";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {DFSBasicsComponent} from "./components/dfs-basics/dfs-basics.component";
import {ExcelToolComponent} from "./components/excel-tool/excel-tool.component";
import {FAQComponent} from "./components/faq/faq.component";
import {AdvFilterComponent} from "./components/lineup-optimizer/adv-filter/adv-filter.component";
import {LineupPlayerFilter} from "./ng-pipes/lineup-opp-filter.pipe";
import {SortGridPipe} from "./ng-pipes/custom-filter.pipe";
import {PlayerGetService} from './services/fetchPlayers';
import {CompGetService} from './services/fetchCompositions';
import {LineupPostService} from './services/postLineups';
import {ProviderComponent} from "./components/provider/provider.component";
import {ProviderPublicComponent} from "./components/provider-public/public.component";



import {InjuriesComponent} from "./components/injuries/injuries.component";
import {ChangePasswordComponent} from "./components/change-password/change-password.component";
import {GeneratedLineupsComponent} from "./components/lineup-optimizer/generated-lineups/generated-lineups.component";
import {SubscribeComponent} from "./components/subscribe/subscribe.component";
import {VerifyAccComponent} from "./components/forgot-password/verify-acc.component";
import {MarketPlaceComponent} from "./components/market-place/market-place.component";
import {ExtensionsComponent} from "./components/extensions/extensions.component";
import {StackingDataFilter} from "./components/lineup-optimizer/adv-filter/stacking-data.pipe";
import {NFLLineupOptimizerComponent} from "./components/nfl-lineup-optimizer/nfl-lineup-optimizer.component";
import {NFLAdvFilterComponent} from "./components/nfl-lineup-optimizer/nfl-filters/nfl-filters.component";
import {ContactAnalyzerComponent} from "./components/contact-analyzer/contact-analyzer.component";
import {GeneratedNFLLineupsComponent} from "./components/nfl-lineup-optimizer/generated-nfl-lineups/generated-nfl-lineups.component";
import {NFLExcelToolComponent} from "./components/excel-tool-nfl/nfl-excel-tool.component";
import {NBALineupOptimizerComponent} from "./components/nba-lineup-optimizer/nba-lineup-optimizer.component";
import {NBAFilterComponent} from "./components/nba-lineup-optimizer/nba-filter/nba-filter.component";
import {GeneratedNBALineupsComponent} from "./components/nba-lineup-optimizer/generated-nba-linups/generated-nba-lineups.component";
import {PodcastComponent} from "./components/podcast/podcast.component";
import {PlanComponent} from "./components/plan/plan.component";
import {VideoComponent} from "./components/video/video.component";
import {FreeOfferComponent} from "./components/free-offer/free-offer.component";


// import {VgCoreModule} from 'videogular2/core';
// import {VgControlsModule} from 'videogular2/controls';
// import {VgOverlayPlayModule} from 'videogular2/overlay-play';
// import {VgBufferingModule} from 'videogular2/buffering';

/**
 * Created by Hiren on 04-06-2017.
 */

@NgModule({
  imports: [
    FrontRoutingModule,
    InfiniteScrollModule,
    SharedModule,
    // VgCoreModule,
    // VgControlsModule,
    // VgOverlayPlayModule,
    // VgBufferingModule
  ],
  declarations: [
    FrontMainComponent,
    FrontFooterComponent,
    FrontHeaderComponent,
    FrontHomeComponent,
    LoginComponent,
    SignUpComponent,
    TestComponent,
    ProviderLineupComponent,
    NewsComponent,
    ArticlesComponent,
    DailyLineupComponent,
    LineupOptimizerComponent,
    ArticleComponent,
    ArticlesComponent,
    ForgotPasswordComponent,
    DFSBasicsComponent,
    ExcelToolComponent,
    FAQComponent,
    AdvFilterComponent,
    ProviderComponent,
    ProviderPublicComponent,
    LineupPlayerFilter,
    SortGridPipe,
    InjuriesComponent,
    ChangePasswordComponent,
    GeneratedLineupsComponent,
    SubscribeComponent,
    VerifyAccComponent,
    MarketPlaceComponent,
    ExtensionsComponent,
    StackingDataFilter,
    NFLLineupOptimizerComponent,
    NFLAdvFilterComponent,
    ContactAnalyzerComponent,
    GeneratedNFLLineupsComponent,
    NFLExcelToolComponent,
    NBALineupOptimizerComponent,
    NBAFilterComponent,
    GeneratedNBALineupsComponent,
    PodcastComponent,
    PlanComponent,
    VideoComponent,
    FreeOfferComponent,
  ],
  exports: [
    ProviderComponent,
    ProviderPublicComponent,
    FrontMainComponent
  ],
  providers: [FrontService, ArticleService, LineupOptimizerService, PlayerGetService, CompGetService, LineupPostService]
})
export class FrontModule {

}
