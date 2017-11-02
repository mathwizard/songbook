import {AfterViewInit, Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {ChordProRoot} from './chordpro/model';
import {ChordproTokenizer} from './chordpro/tokenizer';
import {ChordproParser} from './chordpro/parser';
import {SongService} from '../song.service';

@Component({
  selector: 'app-songview',
  templateUrl: './songview.component.html',
  styleUrls: ['./songview.component.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class SongviewComponent implements OnInit {
  songText: string;
  musician: string;

  chordProRoot: ChordProRoot;
  capo = 0;
  key: string;
  transpose = 0;
  songlistOpened = false;
  fontSizeEm = 1.4

  constructor(private el: ElementRef, private songService: SongService) {
  }


  ngOnInit(): void {
    this.songService.fontSize.subscribe(
      value => {
        this.fontSizeEm = value;
        this.resetView();
      }
    );

    this.songService.selectedSong.subscribe(
      value => {
        if (!value) {
          return;
        }

        this.songText = value.text
        this.transpose = 0;

        if (this.songText) {
          const tokenizer = new ChordproTokenizer(this.songText);
          this.chordProRoot = new ChordproParser(tokenizer).parseTokenizer(true);
          if (this.chordProRoot.capo) {
            if (this.musician && this.chordProRoot.capo.hasOwnProperty(this.musician)) {
              this.capo = this.chordProRoot.capo[this.musician]
            } else if (this.chordProRoot.capo['default']) {
              this.capo = this.chordProRoot.capo['default']
            }
          }
        }

        this.resetView()
        this.songlistOpened = false
      }
    )

    this.songService.musician.subscribe(
      musician => {
        this.musician = musician
        this.resetView()
      }
    )
  }

  setCapo(newCapo: number) {
    if (newCapo >= 0 && newCapo <= 9) {
      this.capo = newCapo;
      this.resetView()
    }
  }

  resetChordsDisplay() {
    let elems: any = this.el.nativeElement.getElementsByClassName('cpChordLyric');
    Array.prototype.forEach.call(elems, chordLyricElem => { chordLyricElem.style.width = '' });

    elems = this.el.nativeElement.getElementsByClassName('cpChord');
    Array.prototype.forEach.call(elems, chordElem => { chordElem.style.marginRight = '' });
  }

  setupChordsDisplay() {
    const elems: any = this.el.nativeElement.getElementsByClassName('cpChordLyric');

    Array.prototype.forEach.call(elems, chordLyricElem => {
      const chordElems: any = chordLyricElem.getElementsByClassName('cpChord');
      const lyricElems: any = chordLyricElem.getElementsByClassName('cpLyric');

      const chordWidth: number = chordElems.length > 0 ? chordElems[0].getBoundingClientRect().width : 0;
      const lyricWidth: number = lyricElems.length > 0 ? lyricElems[0].getBoundingClientRect().width : 0;

      chordElems[0].style.marginRight = `-${chordWidth}px`;
      chordLyricElem.style.width = `${Math.max(chordWidth + 5, lyricWidth)}px`
    })
  }

  setKey(newKey: string) {
    this.key = newKey;
  }

  setTranspose(transpose: number) {
    this.transpose = transpose;
  }

  setMusician(musician: string) {
    this.songService.setMusician(musician);
  }

  clearMusician() {
    this.songService.clearMusician();
  }

  resetView() {
    this.resetChordsDisplay();
    setTimeout(this.setupChordsDisplay.bind(this), 20) // Has to be done like this otherwise reset is not perfomed
  }

  syncDb() {
    this.songService.syncDb();
  }

  setFontSize(fontSize: number) {
    this.songService.setFontSize(fontSize);
  }
}
