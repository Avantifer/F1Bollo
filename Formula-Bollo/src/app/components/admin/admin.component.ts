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
    new SideNavItem('emoji_events', 'Resultados', '/admin/results'),
    new SideNavItem('gavel', 'Penalizaciones', '/admin/penalties'),
    new SideNavItem('article', 'Estatuto', '/admin/statute')
  ];
  activeNavItem: string = '';

  constructor(private router: Router){ }

  ngOnInit(): void {
    this.searchNavItemSelected();
  }

  /**
   * Navigate to the specified URL using the Angular router.
   *
   * @param url - The URL to navigate to.
  */
  navigateByUrl(url: string) : void {
    this.router.navigate([url]);
  }

  /**
   * Select a navigation item and mark it as active while deactivating others.
   *
   * @param event - The target element that triggered the selection.
  */
  selectNavItem(event: EventTarget | null): void {
    if (event === null) return;

    let allSideNavItem: NodeListOf<Element> = document.querySelectorAll(".admin-leftSide-item");

    allSideNavItem.forEach(element => {
      if (element.classList.contains('active')) {
        element.classList.remove('active');
      }
    });

    let divSelected: Element = event as Element;
    if (divSelected.classList.contains('active')) return;
    divSelected.classList.add('active');
  }

  /**
   * Find the active navigation item based on the current URL and set it as the active item.
  */
  searchNavItemSelected(): void {
    let actualNavItem: SideNavItem | undefined = this.sideNavItems.find((sideNavItem : SideNavItem) => sideNavItem.url === this.router.url);

    if (actualNavItem === undefined) return;

    this.activeNavItem = actualNavItem.text;
  }
}
