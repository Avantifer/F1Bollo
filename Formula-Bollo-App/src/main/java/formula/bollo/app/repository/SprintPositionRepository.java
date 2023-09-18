package formula.bollo.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.SprintPosition;

@Repository
public interface SprintPositionRepository extends JpaRepository<SprintPosition, Long> { 
    
}

