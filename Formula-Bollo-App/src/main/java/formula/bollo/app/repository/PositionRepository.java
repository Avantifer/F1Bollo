package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.Position;

public interface PositionRepository extends JpaRepository<Position, Long>{

    List<Position> findByPositionNumber(int positionNumber);
}
