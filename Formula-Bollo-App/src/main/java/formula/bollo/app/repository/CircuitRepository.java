package formula.bollo.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Circuit;

@Repository
public interface CircuitRepository extends JpaRepository<Circuit, Long>{
    
}
