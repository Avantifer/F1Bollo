package formula.bollo.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Driver;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long>{
    
}
