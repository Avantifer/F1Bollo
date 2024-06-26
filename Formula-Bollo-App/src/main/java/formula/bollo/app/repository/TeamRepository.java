package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    
    @Query(value = "SELECT t FROM Team t WHERE t.season.number = ?1")
    List<Team> findBySeason(int seasonNumber);

    @Query(value = "SELECT t FROM Team t WHERE t.season.number = ?1 AND t.name = ?2")
    List<Team> findByNameAndSeason(int seasonNumber, String teamName);

    @Query(value = "SELECT t FROM Team t WHERE t.name = ?1")
    List<Team> findByName(String teamName);
}
