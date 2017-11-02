import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {BlockElementType, ChElement, ChordProRoot, InlineElement, InlineElementType} from './chordpro/model';
import {ChordproTokenizer} from './chordpro/tokenizer';
import {ChordproParser} from './chordpro/parser';
import {ChordproHtmlRenderer} from './chordpro/htmlrenderer';
import {ChordService} from '../chord.service';

@Component({
  selector: 'app-inline-element',
  template: `
    <ng-container [ngSwitch]="cpElem.type">
      <ng-template [ngSwitchCase]="inlineElementType.CHORDPRO_COMMENT">
        <span class="cpComment" *ngIf="shouldDisplayComment(cpElem)">{{cpElem.content}}</span>
      </ng-template>
      <ng-template [ngSwitchCase]="inlineElementType.SONGBOOK_CHORDLYRIC">
          <span class="cpChordLyric">
            <span class="cpChord">{{ getChordDisplay(cpElem.chord) }}</span><span class="cpLyric">{{cpElem.lyric}}</span>
          </span>
      </ng-template>
      <ng-template [ngSwitchCase]="inlineElementType.SONGBOOK_NEWLINE">
        <br/>
      </ng-template>
      <ng-template [ngSwitchCase]="inlineElementType.CHORDPRO_LYRIC">
        {{ cpElem.content }}
      </ng-template>
    </ng-container>`,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class InlineElementComponent {
  @Input() cpElem: any;
  @Input() capo: number;
  @Input() transpose: number;
  @Input() musician: string;
  public inlineElementType = InlineElementType;


  constructor(private chordService: ChordService) {
  }

  public getChordDisplay(originalChord: string) {
    if (originalChord) {
      const transposedChord = this.chordService.transpose(originalChord, this.transpose);
      return this.chordService.capoChord(transposedChord, this.capo)
    } else {
      return null;
    }
  }

  public shouldDisplayComment(cpElem: InlineElement): boolean {
    return !cpElem.forPerson || (this.musician && cpElem.forPerson.toLowerCase() === this.musician.toLowerCase())
  }
}
