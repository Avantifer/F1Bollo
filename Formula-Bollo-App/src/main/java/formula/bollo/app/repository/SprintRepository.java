package formula.bollo.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.Sprint;

public interface SprintRepository extends JpaRepository<Sprint, Long> { 
    
}
