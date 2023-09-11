package formula.bollo.app.config;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.classmate.TypeResolver;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.Contact;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.spi.service.contexts.SecurityContext;

import formula.bollo.app.utils.Constants;

@Configuration
public class SwaggerConfig {
    public static final String AUTHORIZATION_HEADER = "Authorization";

    @Bean
	public Docket apiDocket(TypeResolver typeResolver) {
		return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(getApiInfo())
                .securityContexts(Arrays.asList(securityContext()))
                .securitySchemes(Arrays.asList(apiKey()))
				.select()
				.apis(RequestHandlerSelectors.basePackage("formula.bollo.app"))
				.paths(PathSelectors.any())
				.build();
	}

    private ApiKey apiKey(){
        return new ApiKey("JWT", AUTHORIZATION_HEADER, "header");
    }

    private ApiInfo getApiInfo() {
		return new ApiInfo(
				"API Formula Bollo",
				"A project created by Fernando Ruiz for the purpose of create a web app to control and administrate the competition of formula bollo.",
				"0.0.1",
				Constants.URL_FRONTED + "terms",
				new Contact("Fernando Ruiz", Constants.URL_FRONTED, "ferenandoruiz@gmail.com"),
				"LICENSES",
				Constants.URL_FRONTED + "license",
				Collections.emptyList()
		);
	}

    private List<SecurityReference> defaultAuth(){
        AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
        AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
        authorizationScopes[0] = authorizationScope;
        return Arrays.asList(new SecurityReference("JWT", authorizationScopes));
    }

    private SecurityContext securityContext(){
        return SecurityContext.builder().securityReferences(defaultAuth()).build();
    }
}
