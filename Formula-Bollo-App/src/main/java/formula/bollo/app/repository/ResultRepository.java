package formula.bollo.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.Result;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByDriverId(Long driverId); 
}
