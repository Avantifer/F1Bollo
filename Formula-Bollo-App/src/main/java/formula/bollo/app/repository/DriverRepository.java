package formula.bollo.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.Driver;

public interface DriverRepository extends JpaRepository<Driver, Long>{
    
}
