import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ItemComponent } from './components/item/item.component';
import { HeaderComponent } from './components/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CompanyInfoComponent } from './components/company-info/company-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { QuotationTableComponent } from './components/quotation-table/quotation-table.component';
import { ItemService } from './services/item.service';
import { HttpClientModule } from '@angular/common/http';
import { DisplayedLineComponent } from './components/displayed-line/displayed-line.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    HeaderComponent,
    CompanyInfoComponent,
    QuotationTableComponent,
    DisplayedLineComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
  ],
  providers: [ItemService],
  bootstrap: [AppComponent],
})
export class AppModule {}
