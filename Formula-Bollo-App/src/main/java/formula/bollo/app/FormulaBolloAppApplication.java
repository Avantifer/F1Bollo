package formula.bollo.app;

import formula.bollo.app.config.EnvConfig;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@Configuration
@EntityScan("formula.bollo.app.entity")
@EnableJpaRepositories(basePackages = "formula.bollo.app.repository")
public class FormulaBolloAppApplication {

	public static void main(String[] args) {
		EnvConfig.load();
		SpringApplication.run(FormulaBolloAppApplication.class, args);
	}
}
