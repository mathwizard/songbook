import {
  AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output,
  ViewEncapsulation
} from '@angular/core';
import {SongItem} from '../song.model';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {serialize} from '@angular/compiler/src/i18n/serializers/xml_helper';
import {SongService} from '../song.service';

@Component({
  selector: 'app-songlist',
  templateUrl: './songlist.component.html',
  styleUrls: ['./songlist.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SonglistComponent implements OnInit {

  songs: SongItem[] = [];
  search = '';

  @Output() songSelected: EventEmitter<string> = new EventEmitter(false);


  constructor(private songService: SongService) {
  }

  ngOnInit(): void {
    this.songService.songs.subscribe(
      value => this.songs = value
    )

    this.songService.refreshSongList()
  }

  selectSong(song: SongItem) {
    this.songService.selectSong(song);
    this.search = '';
  }

  get filteredSongs() {
    if (!this.search) {
      return this.songs;
    }

    return this.songs.filter(
      value => {
        return value.title.toLowerCase().indexOf(this.search) !== -1 || value.subtitle.toLowerCase().indexOf(this.search) !== -1;
      });
  }


}
