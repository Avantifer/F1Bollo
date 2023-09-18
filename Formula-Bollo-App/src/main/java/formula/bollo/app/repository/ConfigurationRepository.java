package formula.bollo.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Configuration;

@Repository
public interface ConfigurationRepository extends JpaRepository<Configuration, Long> {
    
}
