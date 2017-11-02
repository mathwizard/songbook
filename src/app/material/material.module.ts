import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatAutocompleteModule, MatInputModule, MatSidenavModule, MatMenuModule, MatListModule, MatInputModule
  ],
  exports: [
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatAutocompleteModule, MatInputModule, MatSidenavModule, MatMenuModule, MatListModule, MatInputModule
  ],
  declarations: []
})
export class MaterialModule { }
