import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { MenubarModule } from "primeng/menubar";
import { ButtonModule } from "primeng/button";
import { InputSwitchModule } from "primeng/inputswitch";
import { ChipModule } from "primeng/chip";
import { SkeletonModule } from "primeng/skeleton";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { PasswordModule } from "primeng/password";
import { ProgressBarModule } from "primeng/progressbar";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DialogModule } from "primeng/dialog";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { ChartModule } from "primeng/chart";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "src/shared/components/header/header.component";
import { HomeComponent } from "./components/home/home.component";
import { HomeDriversComponent } from "./components/home/home-drivers/home-drivers.component";
import { HomeTeamsComponent } from "./components/home/home-teams/home-teams.component";
import { HomeConfigurationComponent } from "./components/home/home-configuration/home-configuration.component";
import { TeamsComponent } from "./components/teams/teams.component";
import { DriversComponent } from "./components/drivers/drivers.component";
import { AdminComponent } from "./components/admin/admin.component";
import { AdminResultsComponent } from "./components/admin/admin-results/admin-results.component";
import { LoginComponent } from "./components/login/login.component";
import { LoaderComponent } from "src/shared/components/loader/loader.component";
import { AdminPenaltiesComponent } from "./components/admin/admin-penalties/admin-penalties.component";
import { StatuteComponent } from "./components/statute/statute.component";
import { ResultsComponent } from "./components/results/results.component";
import { AdminStatuteComponent } from "./components/admin/admin-statute/admin-statute.component";
import { FormulaTableComponent } from "src/shared/components/formula-table/formula-table.component";
import { PageNotFoundComponent } from "src/shared/components/page-not-found/page-not-found.component";
import { FantasyComponent } from "./components/fantasy/fantasy.component";
import { FantasyHomeComponent } from "./components/fantasy/fantasy-home/fantasy-home.component";
import { FantasyLoginComponent } from "./components/fantasy/fantasy-login/fantasy-login.component";
import { FantasyRegisterComponent } from "./components/fantasy/fantasy-register/fantasy-register.component";
import { FantasyTeamComponent } from "./components/fantasy/fantasy-team/fantasy-team.component";
import { FantasyClasificationComponent } from "./components/fantasy/fantasy-clasification/fantasy-clasification.component";
import { FantasyRecoverPasswordComponent } from "./components/fantasy/fantasy-recover-password/fantasy-recover-password.component";
import { FantasyDialogTeamComponent } from "./components/fantasy/fantasy-dialog-team/fantasy-dialog-team.component";
import { DriversInfoComponent } from "./components/drivers/drivers-info/drivers-info.component";

import { AdminGuard } from "src/shared/guards/AdminGuard";
import { LoginGuard } from "src/shared/guards/LoginGuard";
import { FantasyTeamGuard } from "src/shared/guards/FantasyTeamGuard";
import { RecoverPasswordGuard } from "src/shared/guards/RecoverPasswordGuard";

import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { LoaderService } from "./../shared/services/loader.service";
import { LoaderInterceptor } from "./../shared/interceptors/loader.interceptor";
import { PricePipe } from "src/shared/pipes/price.pipe";
import { IsNanPipe } from "src/shared/pipes/isNan.pipe";
import { SpaceToUnderscorePipe } from "src/shared/pipes/spaceToUnderscore.pipe";
import { ThemeService } from "src/shared/services/theme.service";
import { MessageService } from "primeng/api";
import { TeamsInfoComponent } from "./components/teams/teams-info/teams-info.component";
import { FantasyTeamDialogPriceComponent } from "./components/fantasy/fantasy-team/fantasy-team-dialog-price/fantasy-team-dialog-price.component";
import { FantasyTeamDialogPointComponent } from "./components/fantasy/fantasy-team/fantasy-team-dialog-point/fantasy-team-dialog-point.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    HomeDriversComponent,
    HomeTeamsComponent,
    HomeConfigurationComponent,
    TeamsComponent,
    DriversComponent,
    AdminComponent,
    AdminResultsComponent,
    LoginComponent,
    LoaderComponent,
    AdminPenaltiesComponent,
    StatuteComponent,
    ResultsComponent,
    AdminStatuteComponent,
    PageNotFoundComponent,
    FormulaTableComponent,
    FantasyComponent,
    FantasyHomeComponent,
    FantasyLoginComponent,
    FantasyRegisterComponent,
    FantasyTeamComponent,
    FantasyClasificationComponent,
    FantasyRecoverPasswordComponent,
    FantasyDialogTeamComponent,
    DriversInfoComponent,
    TeamsInfoComponent,
    FantasyTeamDialogPriceComponent,
    FantasyTeamDialogPointComponent,
    PricePipe,
    IsNanPipe,
    SpaceToUnderscorePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatTableModule,
    CalendarModule,
    DropdownModule,
    MenubarModule,
    ButtonModule,
    InputSwitchModule,
    ChipModule,
    SkeletonModule,
    InputGroupModule,
    InputGroupAddonModule,
    PasswordModule,
    ProgressBarModule,
    MessagesModule,
    ToastModule,
    InputTextareaModule,
    DialogModule,
    DynamicDialogModule,
    ChartModule
  ],
  providers: [
    AdminGuard,
    LoginGuard,
    FantasyTeamGuard,
    RecoverPasswordGuard,
    MessageService,
    JwtHelperService,
    ThemeService,
    DialogService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
