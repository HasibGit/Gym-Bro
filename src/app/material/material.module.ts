import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatInputModule],
  exports: [MatButtonModule, MatIconModule, MatInputModule],
})
export class MaterialModule {}
