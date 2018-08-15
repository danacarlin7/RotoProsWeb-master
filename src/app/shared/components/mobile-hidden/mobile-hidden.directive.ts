import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appMobileHidden]"
})
export class MobileHiddenDirective implements OnInit {
  hidden: boolean;
  hiddenThreshold = 700;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (window.innerWidth <= this.hiddenThreshold) {
      this.renderer.setStyle(this.elRef.nativeElement, "visibility", "hidden");
      this.hidden = true;
    } else {
      this.hidden = false;
    }
  }

  @HostListener("window:resize", ["$event"]) onResize(event) {
    if (event.target.innerWidth > this.hiddenThreshold && this.hidden) {
      this.renderer.setStyle(this.elRef.nativeElement, "visibility", null);
      this.hidden = false;
    } else if (event.target.innerWidth <= this.hiddenThreshold && !this.hidden) {
      this.renderer.setStyle(this.elRef.nativeElement, "visibility", "hidden");
      this.hidden = true;
    }
  }
}
