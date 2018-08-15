import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from "../../../shared/services/auth.service";
import { ArticleService } from "../../services/article.service";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router, private articleService: ArticleService) {
    localStorage.setItem('free', "0");
  }

  category: any;
  categories: Array<any>;
  posts: Object = {};
  media: Object = {};
  hot: Array<any> = [];
  featured: Array<any> = [];
  top: Array<any> = [];
  newest: Array<any> = [];
  recent: Array<any> = [];
  week: Array<any> = [];
  subTrendingTabs: Array<any> = ['week', 'hot', 'featured', 'top', 'recent', 'newest'];
  subTrendingTabsLabels = {
    week: "Article of the Week",
    hot: "Today’s Hot Topics!",
    featured: "Featured",
    top: "Top-Articles",
    recent: "Recent",
    newest: "Newest"
  };
  activeTab: any;
  subActiveTab: any;
  tmpActiveTab: any;
  tmpSubActiveTab: any;
  activeSingle: any = null;
  isLoading: boolean = false;

  related: Object = {};

  isStatus: any;
  isSubscribeError: any;
  isLoginError: any;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      params => {
        if (params.hasOwnProperty('tab')) {
          this.activeTab = params['tab'];
        }
      }
    );

    this.articleService.fetchCategories().subscribe(
      categories => {
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].id == 1) {
            categories.splice(i, 1);
            break;
          }
        }
        this.categories = categories;

        this.categories.push({
          'count': 20,
          'description': '',
          'id': 20,
          'link': 'https://wordpress.rotopros.com/category/soccer/',
          'loaded': 5,
          'meta': [],
          'name': 'Soccer',
          'parent': 0,
          'slug': 'soccer',
          'taxonomy': 'category'
        });

        console.log(this.categories);
        for (let i = 0; i < this.categories.length; i++) {
          this.categories[i]['loaded'] = 0;
          let category = this.categories[i];
          // if(category.id == 20 )
          //   this.categories[i]['loaded'] = 2;
          if (i == 0) {
            this.activeTab = category.id;
            this.subActiveTab = '';
          }
          this.posts[category.id] = [];
          this.fetchPostsByCat(category);
        }
      }
    );
    this.articleService.fetchRelated().subscribe(
      ids => {
        this.related = ids;
        for (let key in ids) {
          this.fetchPostsByType(key);
        }
      }
    );
  }

  private getIndexOfCategory = (catid: number) => {
    return this.categories.findIndex((category, index) => {
      return category.id === catid;
    });
  };


  fetchPostsByCat(category) {
    let catid = category.id;
    this.isLoading = true;
    this.articleService.fetchPosts({ categories: category['id'], per_page: 5, offset: category['loaded'] }).subscribe(
      posts => {
        this.categories[this.getIndexOfCategory(catid)].loaded += posts.length;
        let mid = [];
        for (let j = 0; j < posts.length; j++) {
          posts[j].extract = this.encodeHtml(posts[j].excerpt.rendered);
          if (posts[j].featured_media)
            mid.push(posts[j].featured_media);
          this.posts[catid].push(posts[j]);
        }
        let mids = mid.join(',');
        if (mids) {
          this.articleService.fetchMedia({ include: mids }).subscribe(
            images => {
              for (let k = 0; k < images.length; k++) {
                let image = images[k];
                this.media[image.id] = image.source_url;
              }
            }
          );
        }
        this.isLoading = false;
      }
    );
  }

  fetchPostsByType(key: string) {
    let cid = this.related[key].join(',');
    this.articleService.fetchPosts({ include: cid }).subscribe(
      posts => {
        let mid = [];
        for (let j = 0; j < posts.length; j++) {
          posts[j].extract = this.encodeHtml(posts[j].excerpt.rendered);
          if (posts[j].featured_media)
            mid.push(posts[j].featured_media);
        }
        this[key] = posts;
        // if(key=='week')
        //   console.log(posts);
        let mids = mid.join(',');
        if (mids) {
          this.articleService.fetchMedia({ include: mids }).subscribe(
            images => {
              for (let k = 0; k < images.length; k++) {
                let image = images[k];
                this.media[image.id] = image.source_url;
              }
            }
          );
        }
      }
    );
  }

  encodeHtml(extract: string) {
    extract = extract.replace(/<[^>]+>/gm, '');
    let txt = document.createElement("textarea");
    txt.innerHTML = extract;
    extract = txt.value;
    if (extract.length > 250)
      extract = extract.substring(0, 250) + ' ...';
    return extract;
  }

  hasPosts(id: number) {
    return (this.posts && this.posts[id]);
  }

  findMedia(id: number) {
    if (!id || !this.media) return false;
    return this.media[id];
  }

  onTabChanged(cat) {
    console.log(cat);
    if (cat.slug == "free-article") {
      localStorage.setItem('free', "1");
    } else {
      localStorage.setItem('free', "0");
    }
    if (cat == 'trending' || this.subTrendingTabs.indexOf(cat) != -1) {
      if (cat == 'trending') {
        this.activeTab = cat;
        this.subActiveTab = 'week';
      } else {
        this.activeTab = 'trending';
        this.subActiveTab = cat;
      }
    } else {
      this.activeTab = cat.id;
      this.subActiveTab = '';
    }
    this.activeSingle = null;
  }

  saveTabSetting() {
    this.tmpSubActiveTab = this.subActiveTab;
    this.tmpActiveTab = this.activeTab;
  }

  restoreTabSetting() {
    this.activeTab = this.tmpActiveTab;
    this.subActiveTab = this.tmpSubActiveTab;
  }

  switchToSingle(post) {
    console.log(post);


    if (!this.authService.isLoggedIn()) {
      if(localStorage.getItem('free') == "1"){
        this.isStatus = true;
        this.isLoginError = false;
        this.isSubscribeError = false;
        this.router.navigate(['articles', post.id])
      } else {
        this.isStatus = false;
        this.isLoginError = true;
        this.isSubscribeError = false;
        $("#openModel").click();
      }
    } else if (this.authService.isLoggedIn() && (localStorage.getItem('free') == "1" || this.authService.isSubscriber(true))) {
        this.isStatus = true;
        this.isLoginError = false;
        this.isSubscribeError = false;
        this.router.navigate(['articles', post.id])
    } else {
      this.isStatus = false;
      this.isLoginError = false;
      this.isSubscribeError = true;

      $("#openModel").click();
    }
  }


  goBackToTab() {
    this.activeSingle = null;
  }

  loadMorePosts(category) {
    if (category.loaded < category.count) {
      this.fetchPostsByCat(category);
    }
  }

  onScroll(category) {
    this.loadMorePosts(category);
  }
}
