import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { TeamsComponent } from "./components/teams/teams.component";
import { DriversComponent } from "./components/drivers/drivers.component";
import { AdminComponent } from "./components/admin/admin.component";
import { LoginComponent } from "./components/login/login.component";
import { AdminGuard } from "src/shared/guards/AdminGuard";
import { AdminResultsComponent } from "./components/admin/admin-results/admin-results.component";
import { AdminPenaltiesComponent } from "./components/admin/admin-penalties/admin-penalties.component";
import { StatuteComponent } from "./components/statute/statute.component";
import { ResultsComponent } from "./components/results/results.component";
import { AdminStatuteComponent } from "./components/admin/admin-statute/admin-statute.component";
import { PageNotFoundComponent } from "src/shared/components/page-not-found/page-not-found.component";
import { FantasyHomeComponent } from "./components/fantasy/fantasy-home/fantasy-home.component";
import { FantasyRegisterComponent } from "./components/fantasy/fantasy-register/fantasy-register.component";
import { LoginGuard } from "src/shared/guards/LoginGuard";
import { FantasyTeamComponent } from "./components/fantasy/fantasy-team/fantasy-team.component";
import { FantasyTeamGuard } from "src/shared/guards/FantasyTeamGuard";
import { FantasyClasificationComponent } from "./components/fantasy/fantasy-clasification/fantasy-clasification.component";
import { FantasyRecoverPasswordComponent } from "./components/fantasy/fantasy-recover-password/fantasy-recover-password.component";
import { RecoverPasswordGuard } from "src/shared/guards/RecoverPasswordGuard";
import { DriversInfoComponent } from "./components/drivers/drivers-info/drivers-info.component";
import { TeamsInfoComponent } from "./components/teams/teams-info/teams-info.component";
import { StatisticsComponent } from "./components/statistics/statistics.component";

const routes: Routes = [
  {
    path: "home",
    redirectTo: "",
    pathMatch: "full",
  },
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "teams",
    component: TeamsComponent,
  },
  {
    path: "teams/:name",
    component: TeamsInfoComponent
  },
  {
    path: "drivers",
    component: DriversComponent
  },
  {
    path: "drivers/:name",
    component: DriversInfoComponent
  },
  {
    path: "results",
    component: ResultsComponent,
  },
  {
    path: "statute",
    component: StatuteComponent,
  },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: "results",
        component: AdminResultsComponent,
      },
      {
        path: "penalties",
        component: AdminPenaltiesComponent,
      },
      {
        path: "statute",
        component: AdminStatuteComponent,
      },
      {
        path: "sprints",
        component: AdminResultsComponent,
      },
    ],
  },
  {
    path: "stats",
    component: StatisticsComponent
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: "fantasy",
    component: FantasyHomeComponent,
  },
  {
    path: "fantasy/login",
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: "fantasy/team",
    component: FantasyTeamComponent,
    canActivate: [FantasyTeamGuard],
  },
  {
    path: "fantasy/clasification",
    component: FantasyClasificationComponent,
  },
  {
    path: "fantasy/register",
    component: FantasyRegisterComponent,
    canActivate: [LoginGuard],
  },
  {
    path: "fantasy/recoverPassword/:token",
    component: FantasyRecoverPasswordComponent,
    canActivate: [RecoverPasswordGuard],
  },
  {
    path: "**",
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
