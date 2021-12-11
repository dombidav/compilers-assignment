import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { HomeRoutingModule } from './home-routing.module'

import { HomeComponent } from './home.component'
import { SharedModule } from '../shared/shared.module'
import { CardModule } from 'primeng/card'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { FileUploadModule } from 'primeng/fileupload'
import { HttpClientModule } from '@angular/common/http'

@NgModule({
  declarations: [ HomeComponent ],
    imports: [
      CommonModule,
      SharedModule,
      HomeRoutingModule,
      CardModule,
      InputTextModule,
      ButtonModule,
      HttpClientModule,
      FileUploadModule
    ]
})
export class HomeModule {}
