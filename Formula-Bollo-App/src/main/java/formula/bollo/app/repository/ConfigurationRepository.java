package formula.bollo.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.Configuration;

public interface ConfigurationRepository extends JpaRepository<Configuration, Long> {
    
}
