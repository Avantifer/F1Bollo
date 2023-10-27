package formula.bollo.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {
    public static final String SECURITY_SCHEME_NAME = "bearerAuth";
     
    @Bean
    public OpenAPI opeanApiFormulaBollo() {
        return new OpenAPI()
                .info(new Info().title("FormulaBollo API")
                .description("API used in FormulaBollo")
                .version("v0.5.0"))
                .addSecurityItem(new SecurityRequirement()
                    .addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                    .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                        .name(SECURITY_SCHEME_NAME)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}
