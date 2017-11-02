import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {BlockElementType, ChElement, ChordProRoot, InlineElement, InlineElementType} from './chordpro/model';
import {ChordproTokenizer} from './chordpro/tokenizer';
import {ChordproParser} from './chordpro/parser';
import {ChordproHtmlRenderer} from './chordpro/htmlrenderer';

@Component({
  selector: 'app-block-element',
  template: `
    <ng-container [ngSwitch]="cpElem.type">
      <ng-template [ngSwitchCase]="blockElementType.CHORDPRO_CHORUS">
        <span class="cpChorus">
          <ng-template ngFor let-cpElem [ngForOf]="cpElem.children">
            <app-inline-element [cpElem]="cpElem" [capo]="capo" [transpose]="transpose" [musician]="musician"></app-inline-element>
          </ng-template>
        </span>
      </ng-template>
      <ng-template [ngSwitchCase]="blockElementType.CHORDPRO_BRIDGE">
        <span class="cpChorus">
          <ng-template ngFor let-cpElem [ngForOf]="cpElem.children">
            <app-inline-element [cpElem]="cpElem" [capo]="capo" [transpose]="transpose" [musician]="musician"></app-inline-element>
          </ng-template>
        </span>
      </ng-template>
      <ng-template [ngSwitchCase]="blockElementType.CHORDPRO_HIGHLIGHT">
        <span class="cpHighlight">
          <ng-template ngFor let-cpElem [ngForOf]="cpElem.children">
            <app-inline-element [cpElem]="cpElem" [capo]="capo" [transpose]="transpose" [musician]="musician"></app-inline-element>
          </ng-template>
        </span>
      </ng-template>
      <ng-template [ngSwitchCase]="blockElementType.CHORDPRO_TAB">
        <span class="cpTab">
          TBD
        </span>
      </ng-template>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class BlockElementComponent {
  @Input() cpElem: any;
  @Input() capo: number;
  @Input() transpose: number;
  @Input() musician: string;
  public blockElementType = BlockElementType;
}
