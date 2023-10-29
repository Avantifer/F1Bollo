package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.FantasyElection;

@Repository
public interface FantasyElectionRepository extends JpaRepository<FantasyElection, Long>{
    @Query(value = "SELECT fe FROM Fantasy_election fe WHERE fe.season.number = ?1")
    List<FantasyElection> findBySeason(int seasonNumber);
}
