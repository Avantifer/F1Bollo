package formula.bollo.app.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.Season;
import java.util.List;


@Repository
public interface SeasonRepository extends JpaRepository<Season, Long> {
    
    List<Season> findByNumber(int number);
}
