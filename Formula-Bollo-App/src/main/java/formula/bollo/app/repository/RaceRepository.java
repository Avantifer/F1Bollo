package formula.bollo.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.Race;

public interface RaceRepository  extends JpaRepository<Race, Long>{
    
}
