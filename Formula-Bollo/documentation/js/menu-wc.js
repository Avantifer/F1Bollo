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
                                            'data-bs-target="#components-links-module-AppModule-ae579e561d3768e05b3f319515908305a1cd6f3e81d96ed98bf592ec8ce077752ae11a9ce54a43aac1f25c088d753c0ee31e2ed735e7f6849f370b7ea7428bc2"' : 'data-bs-target="#xs-components-links-module-AppModule-ae579e561d3768e05b3f319515908305a1cd6f3e81d96ed98bf592ec8ce077752ae11a9ce54a43aac1f25c088d753c0ee31e2ed735e7f6849f370b7ea7428bc2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-ae579e561d3768e05b3f319515908305a1cd6f3e81d96ed98bf592ec8ce077752ae11a9ce54a43aac1f25c088d753c0ee31e2ed735e7f6849f370b7ea7428bc2"' :
                                            'id="xs-components-links-module-AppModule-ae579e561d3768e05b3f319515908305a1cd6f3e81d96ed98bf592ec8ce077752ae11a9ce54a43aac1f25c088d753c0ee31e2ed735e7f6849f370b7ea7428bc2"' }>
                                            <li class="link">
                                                <a href="components/AdminComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DriversComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DriversComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PenaltiesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PenaltiesComponent</a>
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
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-ae579e561d3768e05b3f319515908305a1cd6f3e81d96ed98bf592ec8ce077752ae11a9ce54a43aac1f25c088d753c0ee31e2ed735e7f6849f370b7ea7428bc2"' : 'data-bs-target="#xs-injectables-links-module-AppModule-ae579e561d3768e05b3f319515908305a1cd6f3e81d96ed98bf592ec8ce077752ae11a9ce54a43aac1f25c088d753c0ee31e2ed735e7f6849f370b7ea7428bc2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-ae579e561d3768e05b3f319515908305a1cd6f3e81d96ed98bf592ec8ce077752ae11a9ce54a43aac1f25c088d753c0ee31e2ed735e7f6849f370b7ea7428bc2"' :
                                        'id="xs-injectables-links-module-AppModule-ae579e561d3768e05b3f319515908305a1cd6f3e81d96ed98bf592ec8ce077752ae11a9ce54a43aac1f25c088d753c0ee31e2ed735e7f6849f370b7ea7428bc2"' }>
                                        <li class="link">
                                            <a href="injectables/AdminGuard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminGuard</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LoaderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoaderService</a>
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
                                <a href="classes/Admin.html" data-type="entity-link" >Admin</a>
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
                                <a href="classes/DriverPenalties.html" data-type="entity-link" >DriverPenalties</a>
                            </li>
                            <li class="link">
                                <a href="classes/DriverPoints.html" data-type="entity-link" >DriverPoints</a>
                            </li>
                            <li class="link">
                                <a href="classes/HeaderLinks.html" data-type="entity-link" >HeaderLinks</a>
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
                                <a href="classes/SideNavItem.html" data-type="entity-link" >SideNavItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/Team.html" data-type="entity-link" >Team</a>
                            </li>
                            <li class="link">
                                <a href="classes/TeamWithDrivers.html" data-type="entity-link" >TeamWithDrivers</a>
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
                                    <a href="injectables/AdminService.html" data-type="entity-link" >AdminService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CircuitService.html" data-type="entity-link" >CircuitService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigurationService.html" data-type="entity-link" >ConfigurationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DriverService.html" data-type="entity-link" >DriverService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoaderService.html" data-type="entity-link" >LoaderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessageService.html" data-type="entity-link" >MessageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PenaltyService.html" data-type="entity-link" >PenaltyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PenaltySeverityService.html" data-type="entity-link" >PenaltySeverityService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RaceService.html" data-type="entity-link" >RaceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResultService.html" data-type="entity-link" >ResultService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TeamService.html" data-type="entity-link" >TeamService</a>
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