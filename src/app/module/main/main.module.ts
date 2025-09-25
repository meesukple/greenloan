import { CommonModule } from "@angular/common";
import { HomeRoutingModule } from "./main-routing.module";
import { ReactiveFormsModule } from "@angular/forms";

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { UiInputComponent } from "../../../shared/ui-input/ui-input.component";
import { DashBoardComponent } from "./dashboard/dashBoard.component";
import { LoanTableComponent } from "../../../shared/table/loan-table.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [HomeComponent, DashBoardComponent],
  imports: [
   CommonModule,
   HomeRoutingModule,
   ReactiveFormsModule,
   RouterModule,
   UiInputComponent,
   LoanTableComponent
  ],
  exports: [HomeComponent, DashBoardComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MainModule {}
