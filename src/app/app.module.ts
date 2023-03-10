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
import { MatButtonModule } from '@angular/material/button';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CardTotalComponent } from './components/card-total/card-total.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    HeaderComponent,
    CompanyInfoComponent,
    QuotationTableComponent,
    CardTotalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
    MatTableModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [ItemService],
  bootstrap: [AppComponent],
})
export class AppModule {}
