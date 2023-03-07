import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ItemComponent } from './components/item/item.component';
import { MainGroupComponent } from './components/main-group/main-group.component';
import { SubGroupComponent } from './components/sub-group/sub-group.component';
import { HeaderComponent } from './components/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CompanyInfoComponent } from './components/company-info/company-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { QuotationTableComponent } from './components/quotation-table/quotation-table.component';
import { ItemService } from './services/item.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    MainGroupComponent,
    SubGroupComponent,
    HeaderComponent,
    CompanyInfoComponent,
    QuotationTableComponent,
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
