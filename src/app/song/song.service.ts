import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SongItem} from './song.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class SongService {

  private songList: SongItem[] = [];

  public songs = new BehaviorSubject<SongItem[]>([]);
  public selectedSong = new BehaviorSubject<SongItem>(null);
  public musician = new BehaviorSubject<string>(null);
  public fontSize = new BehaviorSubject<number>(1.4);

  private musicianLocalStorageKey = 'musician';
  private fontSizeLocalStorageKey = 'songFontSize';

  constructor(private http: HttpClient) {
    const localStorageMusician = localStorage.getItem(this.musicianLocalStorageKey);
    if (localStorageMusician) {
      this.musician.next(localStorageMusician)
    }

    const localStorageFontSize = localStorage.getItem(this.fontSizeLocalStorageKey);
    if (localStorageFontSize) {
      this.fontSize.next(parseFloat(localStorageFontSize))
    }

    this.songs.subscribe(value => this.songList = value);
  }


  setMusician(musician: string) {
    localStorage.setItem(this.musicianLocalStorageKey, musician);
    this.musician.next(musician);
  }

  clearMusician() {
    localStorage.removeItem(this.musicianLocalStorageKey);
    this.musician = undefined;
  }

  refreshSongList() {
    this.http.get('/api/song').subscribe(
      (songsList: SongItem[]) => this.songs.next(songsList),
      error2 => this.loadDb()
    )
  }

  selectSong(song: SongItem) {
    if (!song) return;

    this.http.get(`/api/song/${song.apiName}`, {responseType: 'text'}).subscribe(
      (songText: string) => {
        song.text = songText
        this.selectedSong.next(song);
      },
      error2 => {
        this.selectedSong.next(song)
      }
    )
  }

  loadDb() {
    const serializedSongDb = localStorage.getItem('songDb');
    if (serializedSongDb) {
      this.songs.next(JSON.parse(serializedSongDb));
    }
  }

  syncDb() {
    const db: SongItem[] = [];

    this.http.get('/api/song').subscribe(
      (songsList: SongItem[]) => {
        songsList.forEach(value => {
          this.http.get(`/api/song/${value.apiName}`, {responseType: 'text'}).subscribe(
            (songText: string) => {
              value.text = songText
              db.push(value);
              localStorage.setItem('songDb', JSON.stringify(db));
              this.songs.next(db)
            }
          )
        })
      }
    )
  }

  setFontSize(fontSize: number) {
    localStorage.setItem(this.fontSizeLocalStorageKey, '' + fontSize);
    this.fontSize.next(fontSize);
  }

}
