import { Season } from "src/shared/models/season";

export const environment = {
  production: true,
  apiUrl: "https://formulabollo.es:8443",
  seasonActual: new Season(2, "Temporada 2", 2),
};
