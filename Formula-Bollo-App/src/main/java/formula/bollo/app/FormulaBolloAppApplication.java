package formula.bollo.app;

import com.fasterxml.classmate.TypeResolver;

import formula.bollo.app.config.EnvConfig;
import formula.bollo.app.utils.Constants;

import java.time.LocalDate;
import java.util.Collections;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.async.DeferredResult;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.WildcardType;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
import static springfox.documentation.schema.AlternateTypeRules.newRule;

@SpringBootApplication
@EnableSwagger2
@Configuration
public class FormulaBolloAppApplication {

	public static void main(String[] args) {
		EnvConfig.load();
		SpringApplication.run(FormulaBolloAppApplication.class, args);
	}

	@Bean
	public Docket apiDocket(TypeResolver typeResolver) {
		return new Docket(DocumentationType.SWAGGER_2)
				.select()
				.apis(RequestHandlerSelectors.any())
				.paths(PathSelectors.any())
				.build()
				.pathMapping("/")
				.directModelSubstitute(LocalDate.class, String.class)
				.genericModelSubstitutes(ResponseEntity.class)
				.alternateTypeRules(
					newRule(typeResolver.resolve(DeferredResult.class,
						typeResolver.resolve(ResponseEntity.class, WildcardType.class)),
						typeResolver.resolve(WildcardType.class)))
				.useDefaultResponseMessages(false)
				.apiInfo(getApiInfo());
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

}
