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
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
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
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [ItemService],
  bootstrap: [AppComponent],
})
export class AppModule {}
