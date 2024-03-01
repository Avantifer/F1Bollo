import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ThemeService {

  themeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  theme$: Observable<boolean> = this.themeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document) {
    const storedTheme: string | null = localStorage.getItem("theme");

    if (storedTheme) {
      this.themeSubject.next(storedTheme === "dark");
    }
  }

  /**
   * Check what theme is selected, if there is no one selected change theme.
   */
  checkTheme(): boolean {
    const theme: boolean | null = localStorage.getItem("theme") === "dark";
    const themeSelection: string = theme ? "dark" : "light";

    if (theme) {
      this.themeSubject.next(theme);
      const themeLink: HTMLLinkElement = this.document.getElementById(
        "app-theme",
      ) as HTMLLinkElement;

      if (!themeLink) return false;
      themeLink.href = "lara-" + themeSelection + "-blue.css";
    }

    return theme;
  }

  /**
   * Change theme and colors based of inputSwitch.
   */
  changeTheme(): void {
    const theme: string = this.themeSubject.value === false ? "dark" : "light";
    localStorage.setItem("theme", theme);

    const themeLink: HTMLLinkElement = this.document.getElementById(
      "app-theme",
    ) as HTMLLinkElement;

    if (!themeLink) return;
    themeLink.href = "lara-" + theme + "-blue.css";
    this.themeSubject.next(theme === "dark");
  }

}
