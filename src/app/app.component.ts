import {AfterViewInit, Component, ElementRef, ViewEncapsulation} from '@angular/core';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {FormControl} from '@angular/forms';
import {ChordproParser} from './song/songview/chordpro/parser';
import {ChordproTokenizer} from './song/songview/chordpro/tokenizer';
import {ChordProRoot} from './song/songview/chordpro/model';
import {ChordproHtmlRenderer} from './song/songview/chordpro/htmlrenderer';
import {element} from 'protractor';

@Component({
  selector: 'zp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  constructor(private el: ElementRef) {
  }

}
