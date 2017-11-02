import { BrowserModule } from '@angular/platform-browser';
import {Form, FormsModule, ReactiveFormsModule} from '@angular/forms'
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import {SongviewComponent} from './song/songview/songview.component';
import {CommonModule} from '@angular/common';
import {InlineElementComponent} from './song/songview/inline-element.component';
import {BlockElementComponent} from './song/songview/block-element.component';
import {SonglistComponent} from './song/songlist/songlist.component';
import {HttpClientModule} from '@angular/common/http';
import {SongService} from './song/song.service';
import {ChordService} from './song/chord.service';
import {ServiceWorkerModule} from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    SongviewComponent,
    InlineElementComponent,
    BlockElementComponent,
    SonglistComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js')
  ],
  providers: [SongService, ChordService],
  bootstrap: [AppComponent]
})
export class AppModule { }
