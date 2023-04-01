import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaintBlockModule } from './paint-block/paint-block.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // import FormsModule

@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, PaintBlockModule, FormsModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
