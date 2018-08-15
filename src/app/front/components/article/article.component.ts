import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from "../../services/article.service";
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  constructor(private activatedR: ActivatedRoute, private router: Router, private articleService: ArticleService, private meta: Meta) {
  }

  id: any;
  article: any;
  category: any;

  ngOnInit() {
    this.activatedR.params.subscribe(
      params => {
        this.id = +params['id'];
        this.articleService.fetchPost(this.id).subscribe(
          response => {
            this.article = response;
            console.log(this.article);

            this.meta.addTag({ name: 'twitter:title', content: this.article.title.rendered });

          }
        );

        this.articleService.fetchMedia({ parent: 4253 }).subscribe(
          response => {
            // this.article = response;
            // console.log(this.article);
            console.log(response[0].source_url);
            // this.meta.addTag({ name: 'author', content: 'How to use Angular 4 meta service' });
            // this.meta.addTag({ name: 'author', content: 'talkingdotnet' });
            if (response && response[0].source_url)
              this.meta.addTag({ name: 'twitter:image', content: response[0].source_url });
            // <meta name="twitter:card" content="summary" />
            // <meta name="twitter:site" content="@RotoProsDFS" />
            // <meta name="twitter:title" content="Small Island Developing States Photo Submission" />
            // <meta name="twitter:description" content="View the album on Flickr." />
            // <meta name="twitter:image" content="https://farm6.staticflickr.com/5510/14338202952_93595258ff_z.jpg" />
          }
        );
      }
    );
  }

  btnBackClick() {
    this.router.navigate(['/articles'])
  }
}
