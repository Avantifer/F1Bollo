package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Position;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long>{

    List<Position> findByPositionNumber(int positionNumber);
}
