package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Constructor;

@Repository
public interface ConstructorRepository extends JpaRepository<Constructor, Long> {

    @Query(value = "SELECT c FROM Constructor c WHERE c.team.id = ?1")
    List<Constructor> findByTeamId(Long teamId);
}

