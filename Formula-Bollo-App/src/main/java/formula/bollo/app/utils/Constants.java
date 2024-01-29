package formula.bollo.app.utils;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

public class Constants {

    private Constants() { }
    
    // Tags
    public static final String TAG_USER = "User";
    public static final String TAG_USER_SUMMARY = "Operations related with users";

    public static final String TAG_ARCHIVE = "Archives";
    public static final String TAG_ARCHIVE_SUMMARY = "Operations related with files";

    public static final String TAG_CIRCUIT = "Circuits";
    public static final String TAG_CIRCUIT_SUMMARY = "Operations related with circuits";

    public static final String TAG_CONFIGURATION = "Configurations";
    public static final String TAG_CONFIGURATION_SUMMARY = "Operations related with Configurations";

    public static final String TAG_DRIVER = "Drivers";
    public static final String TAG_DRIVER_SUMMARY = "Operations related with drivers";

    public static final String TAG_PENALTY = "Penalties";
    public static final String TAG_PENALTY_SUMMARY = "Operations related with penalties";

    public static final String TAG_PENALTY_SEVERITY = "PenaltiesSeverity";
    public static final String TAG_PENALTY_SEVERITY_SUMMARY = "Operations related with the severity of penalties";

    public static final String TAG_RACE = "Races";
    public static final String TAG_RACE_SUMMARY = "Operations related with races";

    public static final String TAG_RESULT = "Results";
    public static final String TAG_RESULT_SUMMARY = "Operations related with results";

    public static final String TAG_TEAM = "Teams";
    public static final String TAG_TEAM_SUMMARY = "Operations related with teams";

    public static final String TAG_SEASON = "Seasons";
    public static final String TAG_SEASON_SUMMARY = "Operations related with seasons";

    public static final String TAG_FANTASY = "Fantasy";
    public static final String TAG_FANTASY_SUMMARY = "Operations related with fantasy section";

    // Endpoints
    public static final String ENDPOINT_USER = "/user";
    public static final String ENDPOINT_ARCHIVES = "/archives";
    public static final String ENDPOINT_CIRCUIT = "/circuits";
    public static final String ENDPOINT_CONFIGURATION = "/configurations";
    public static final String ENDPOINT_DRIVER = "/drivers";
    public static final String ENDPOINT_PENALTY = "/penalties";
    public static final String ENDPOINT_PENALTY_SEVERITY = "/penaltiesSeverity";
    public static final String ENDPOINT_RACE = "/races";
    public static final String ENDPOINT_RESULT = "/results";
    public static final String ENDPOINT_TEAMS = "/teams";
    public static final String ENDPOINT_SEASONS = "/seasons";
    public static final String ENDPOINT_FANTASY = "/fantasy";
    
    // Errors
    public static final String ERROR_UNEXPECTED = "Error inesperado";
    public static final String ERROR_BBDD_GENERIC = "Hubo un problema con la base de datos";
    public static final String ERROR_GENERIC = "Hubo un error. Contacta con el administrador";
    public static final String ERROR_INVALID_CREDENTIALS = "Las credenciales no son válidas";
    public static final String ERROR_SEASON = "Hubo un problema con las temporadas";
    public static final String ERROR_USERNAME_ALREADY_EXISTS = "El usuario ya existe con ese nombre";
    public static final String ERROR_EMAIL_ALREADY_EXISTS = "El correo ya ha sido utilizado";
    public static final String ERROR_USER_NOT_EXISTS = "El usuario no existe";
    
    //Urls
    public static final String PRODUCTION_FRONTEND = "https://formulabollo.es/";
    public static final String LOCAL_FRONTEND = "http://localhost:4200";

    public static final int ACTUAL_SEASON = 1;
    public static final HttpHeaders HEADERS_TEXT_PLAIN = createHeaders();
    
    private static HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        return headers;
    }
}
