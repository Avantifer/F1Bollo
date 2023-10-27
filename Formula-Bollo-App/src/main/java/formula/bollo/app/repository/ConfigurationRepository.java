package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Configuration;

@Repository
public interface ConfigurationRepository extends JpaRepository<Configuration, Long> {
    @Query(value = "SELECT c FROM Configuration c WHERE c.season.number = ?1")
    List<Configuration> findBySeason(int seasonNumber);
}
