package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Driver;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long>{
    @Query(value = "SELECT d FROM Driver d WHERE d.season.number = ?1")
    List<Driver> findBySeason(int seasonNumber);
}
