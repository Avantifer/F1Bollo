import { Season } from "src/shared/models/season";

export const environment = {
  production: false,
  apiUrl: "http://localhost:8080",
  seasonActual: new Season(2, "Temporada 2", 2),
};
