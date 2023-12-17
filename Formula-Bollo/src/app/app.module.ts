import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CalendarModule } from 'primeng/calendar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { TeamsComponent } from './components/teams/teams.component';
import { DriversComponent } from './components/drivers/drivers.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminResultsComponent } from './components/admin/admin-results/admin-results.component';
import { LoginComponent } from './components/login/login.component';
import { LoaderComponent } from 'src/shared/components/loader/loader.component';
import { AdminPenaltiesComponent } from './components/admin/admin-penalties/admin-penalties.component';
import { StatuteComponent } from './components/statute/statute.component';
import { ResultsComponent } from './components/results/results.component';
import { AdminStatuteComponent } from './components/admin/admin-statute/admin-statute.component';
import { FormulaTableComponent } from 'src/shared/components/formula-table/formula-table.component';
import { PageNotFoundComponent } from 'src/shared/components/page-not-found/page-not-found.component';
import { FantasyComponent } from './components/fantasy/fantasy.component';
import { FantasyHomeComponent } from './components/fantasy/fantasy-home/fantasy-home.component';
import { FantasyLoginComponent } from './components/fantasy/fantasy-login/fantasy-login.component';
import { FantasyRegisterComponent } from './components/fantasy/fantasy-register/fantasy-register.component';
import { FantasyTeamComponent } from './components/fantasy/fantasy-team/fantasy-team.component';
import { FantasyClasificationComponent } from './components/fantasy/fantasy-clasification/fantasy-clasification.component';
import { FantasyRecoverPasswordComponent } from './components/fantasy/fantasy-recover-password/fantasy-recover-password.component';

import { AdminGuard } from 'src/shared/guards/AdminGuard';
import { LoginGuard } from 'src/shared/guards/LoginGuard';
import { FantasyTeamGuard } from 'src/shared/guards/FantasyTeamGuard';
import { RecoverPasswordGuard } from 'src/shared/guards/RecoverPasswordGuard';

import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { LoaderService } from './../shared/services/loader.service';
import { LoaderInterceptor } from './../shared/interceptors/loader.interceptor';
import { FantasyDialogMailComponent } from './components/fantasy/fantasy-dialog-mail/fantasy-dialog-mail.component';
import { PricePipe } from 'src/shared/pipes/price.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
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
    FantasyDialogMailComponent,
    PricePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    CalendarModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    FontAwesomeModule,
    MatProgressBarModule,
    MatDialogModule
  ],
  providers: [
    AdminGuard,
    LoginGuard,
    FantasyTeamGuard,
    RecoverPasswordGuard,
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
