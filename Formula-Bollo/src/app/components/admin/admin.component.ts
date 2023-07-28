import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavItem } from 'src/shared/models/sideNavItems';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  sideNavItems: SideNavItem[] = [
    new SideNavItem('emoji_events', 'Resultados', '/admin/modify_results')
  ];
  activeNavItem: string = '';

  constructor(private router: Router){ }

  ngOnInit(): void {
    this.searchNavItemSelected();
  }

  /**
   * Navigate to show the component selected
   * @memberof AdminComponent
  */
  navigateByUrl(url: string) : void {
    this.router.navigate([url]);
  }

  /**
   * Show what navItem is selected
   * @memberof AdminComponent
  */
  selectNavItem(event: EventTarget | null): void {
    if (event === null) return;

    let divSelected: Element = event as Element;

    if (divSelected.classList.contains('active')) return;

    divSelected.classList.add('active');
    console.log(divSelected.classList)
  }

  /**
   * Know in what component he is when refresh application
   * @memberof AdminComponent
  */
  searchNavItemSelected(): void {
    let actualNavItem: SideNavItem | undefined = this.sideNavItems.find((sideNavItem : SideNavItem) => sideNavItem.url === this.router.url);

    if (actualNavItem === undefined) return;

    this.activeNavItem = actualNavItem.text;
  }
}
