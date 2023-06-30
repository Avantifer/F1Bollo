package formula.bollo.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.Team;

public interface TeamRepository extends JpaRepository<Team, Long> {
    
}
