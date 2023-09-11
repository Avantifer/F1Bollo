package formula.bollo.app;

import formula.bollo.app.config.EnvConfig;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@EnableSwagger2
@Configuration
public class FormulaBolloAppApplication {

	public static void main(String[] args) {
		EnvConfig.load();
		SpringApplication.run(FormulaBolloAppApplication.class, args);
	}
}
