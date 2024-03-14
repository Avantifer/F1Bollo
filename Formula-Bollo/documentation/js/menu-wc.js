'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">formula-bollo documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-74fd4d92eecd46a3659e0f1031d06bf948e5c5f1f19b6681fc97b8b34ca061ec2e1d8c512458e7f3c3b3aab7d70ac8b2a68b742481d6a3139dec2c0ec447a175"' : 'data-bs-target="#xs-components-links-module-AppModule-74fd4d92eecd46a3659e0f1031d06bf948e5c5f1f19b6681fc97b8b34ca061ec2e1d8c512458e7f3c3b3aab7d70ac8b2a68b742481d6a3139dec2c0ec447a175"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-74fd4d92eecd46a3659e0f1031d06bf948e5c5f1f19b6681fc97b8b34ca061ec2e1d8c512458e7f3c3b3aab7d70ac8b2a68b742481d6a3139dec2c0ec447a175"' :
                                            'id="xs-components-links-module-AppModule-74fd4d92eecd46a3659e0f1031d06bf948e5c5f1f19b6681fc97b8b34ca061ec2e1d8c512458e7f3c3b3aab7d70ac8b2a68b742481d6a3139dec2c0ec447a175"' }>
                                            <li class="link">
                                                <a href="components/AdminComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminPenaltiesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminPenaltiesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminResultsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminResultsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminStatuteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminStatuteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DriversComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DriversComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DriversInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DriversInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FantasyClasificationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FantasyClasificationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FantasyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FantasyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FantasyDialogTeamComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FantasyDialogTeamComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FantasyHomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FantasyHomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FantasyLoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FantasyLoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FantasyRecoverPasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FantasyRecoverPasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FantasyRegisterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FantasyRegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FantasyTeamComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FantasyTeamComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FantasyTeamDialogPointComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FantasyTeamDialogPointComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FantasyTeamDialogPriceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FantasyTeamDialogPriceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FormulaTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FormulaTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeConfigurationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeConfigurationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeDriversComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeDriversComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeTeamsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeTeamsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageNotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageNotFoundComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResultsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatuteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatuteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TeamsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TeamsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TeamsInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TeamsInfoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-74fd4d92eecd46a3659e0f1031d06bf948e5c5f1f19b6681fc97b8b34ca061ec2e1d8c512458e7f3c3b3aab7d70ac8b2a68b742481d6a3139dec2c0ec447a175"' : 'data-bs-target="#xs-injectables-links-module-AppModule-74fd4d92eecd46a3659e0f1031d06bf948e5c5f1f19b6681fc97b8b34ca061ec2e1d8c512458e7f3c3b3aab7d70ac8b2a68b742481d6a3139dec2c0ec447a175"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-74fd4d92eecd46a3659e0f1031d06bf948e5c5f1f19b6681fc97b8b34ca061ec2e1d8c512458e7f3c3b3aab7d70ac8b2a68b742481d6a3139dec2c0ec447a175"' :
                                        'id="xs-injectables-links-module-AppModule-74fd4d92eecd46a3659e0f1031d06bf948e5c5f1f19b6681fc97b8b34ca061ec2e1d8c512458e7f3c3b3aab7d70ac8b2a68b742481d6a3139dec2c0ec447a175"' }>
                                        <li class="link">
                                            <a href="injectables/AdminGuard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminGuard</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FantasyTeamGuard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FantasyTeamGuard</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LoaderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoaderService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LoginGuard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginGuard</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RecoverPasswordGuard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecoverPasswordGuard</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ThemeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThemeService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-AppModule-74fd4d92eecd46a3659e0f1031d06bf948e5c5f1f19b6681fc97b8b34ca061ec2e1d8c512458e7f3c3b3aab7d70ac8b2a68b742481d6a3139dec2c0ec447a175"' : 'data-bs-target="#xs-pipes-links-module-AppModule-74fd4d92eecd46a3659e0f1031d06bf948e5c5f1f19b6681fc97b8b34ca061ec2e1d8c512458e7f3c3b3aab7d70ac8b2a68b742481d6a3139dec2c0ec447a175"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-74fd4d92eecd46a3659e0f1031d06bf948e5c5f1f19b6681fc97b8b34ca061ec2e1d8c512458e7f3c3b3aab7d70ac8b2a68b742481d6a3139dec2c0ec447a175"' :
                                            'id="xs-pipes-links-module-AppModule-74fd4d92eecd46a3659e0f1031d06bf948e5c5f1f19b6681fc97b8b34ca061ec2e1d8c512458e7f3c3b3aab7d70ac8b2a68b742481d6a3139dec2c0ec447a175"' }>
                                            <li class="link">
                                                <a href="pipes/IsNanPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IsNanPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/PricePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PricePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SpaceToUnderscorePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SpaceToUnderscorePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Archive.html" data-type="entity-link" >Archive</a>
                            </li>
                            <li class="link">
                                <a href="classes/Circuit.html" data-type="entity-link" >Circuit</a>
                            </li>
                            <li class="link">
                                <a href="classes/Configuration.html" data-type="entity-link" >Configuration</a>
                            </li>
                            <li class="link">
                                <a href="classes/Driver.html" data-type="entity-link" >Driver</a>
                            </li>
                            <li class="link">
                                <a href="classes/DriverInfo.html" data-type="entity-link" >DriverInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/DriverPenalties.html" data-type="entity-link" >DriverPenalties</a>
                            </li>
                            <li class="link">
                                <a href="classes/DriverPoints.html" data-type="entity-link" >DriverPoints</a>
                            </li>
                            <li class="link">
                                <a href="classes/FantasyElection.html" data-type="entity-link" >FantasyElection</a>
                            </li>
                            <li class="link">
                                <a href="classes/FantasyInfo.html" data-type="entity-link" >FantasyInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/FantasyPointsDriver.html" data-type="entity-link" >FantasyPointsDriver</a>
                            </li>
                            <li class="link">
                                <a href="classes/FantasyPointsTeam.html" data-type="entity-link" >FantasyPointsTeam</a>
                            </li>
                            <li class="link">
                                <a href="classes/FantasyPointsUser.html" data-type="entity-link" >FantasyPointsUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/FantasyPriceDriver.html" data-type="entity-link" >FantasyPriceDriver</a>
                            </li>
                            <li class="link">
                                <a href="classes/FantasyPriceTeam.html" data-type="entity-link" >FantasyPriceTeam</a>
                            </li>
                            <li class="link">
                                <a href="classes/HeaderLinks.html" data-type="entity-link" >HeaderLinks</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderBy.html" data-type="entity-link" >OrderBy</a>
                            </li>
                            <li class="link">
                                <a href="classes/Penalty.html" data-type="entity-link" >Penalty</a>
                            </li>
                            <li class="link">
                                <a href="classes/PenaltySeverity.html" data-type="entity-link" >PenaltySeverity</a>
                            </li>
                            <li class="link">
                                <a href="classes/Position.html" data-type="entity-link" >Position</a>
                            </li>
                            <li class="link">
                                <a href="classes/Race.html" data-type="entity-link" >Race</a>
                            </li>
                            <li class="link">
                                <a href="classes/RacePenalties.html" data-type="entity-link" >RacePenalties</a>
                            </li>
                            <li class="link">
                                <a href="classes/Result.html" data-type="entity-link" >Result</a>
                            </li>
                            <li class="link">
                                <a href="classes/Season.html" data-type="entity-link" >Season</a>
                            </li>
                            <li class="link">
                                <a href="classes/SideNavItem.html" data-type="entity-link" >SideNavItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/Team.html" data-type="entity-link" >Team</a>
                            </li>
                            <li class="link">
                                <a href="classes/TeamInfo.html" data-type="entity-link" >TeamInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/TeamWithDrivers.html" data-type="entity-link" >TeamWithDrivers</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdminGuard.html" data-type="entity-link" >AdminGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ArchiveApiService.html" data-type="entity-link" >ArchiveApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthJWTService.html" data-type="entity-link" >AuthJWTService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CircuitApiService.html" data-type="entity-link" >CircuitApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigurationApiService.html" data-type="entity-link" >ConfigurationApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DriverApiService.html" data-type="entity-link" >DriverApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FantasyApiService.html" data-type="entity-link" >FantasyApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FantasyTeamGuard.html" data-type="entity-link" >FantasyTeamGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoaderService.html" data-type="entity-link" >LoaderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoginGuard.html" data-type="entity-link" >LoginGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessageInfoService.html" data-type="entity-link" >MessageInfoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PenaltyApiService.html" data-type="entity-link" >PenaltyApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PenaltySeverityApiService.html" data-type="entity-link" >PenaltySeverityApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RaceApiService.html" data-type="entity-link" >RaceApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RecoverPasswordGuard.html" data-type="entity-link" >RecoverPasswordGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResultApiService.html" data-type="entity-link" >ResultApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SeasonApiService.html" data-type="entity-link" >SeasonApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TeamApiService.html" data-type="entity-link" >TeamApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThemeService.html" data-type="entity-link" >ThemeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserApiService.html" data-type="entity-link" >UserApiService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/LoaderInterceptor.html" data-type="entity-link" >LoaderInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});