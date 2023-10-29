package formula.bollo.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "fantasy_election")
@Data
public class FantasyElection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "driver_host_id", referencedColumnName = "id")
    private Driver driverHost;

    @ManyToOne
    @JoinColumn(name = "driver_selected_one_id", referencedColumnName = "id")
    private Driver driverSelectedOne;

    @ManyToOne
    @JoinColumn(name = "driver_selected_two_id", referencedColumnName = "id")
    private Driver driverSelectedTwo;

    @ManyToOne
    @JoinColumn(name = "driver_selected_three_id", referencedColumnName = "id")
    private Driver driverSelectedThree;

    @ManyToOne
    @JoinColumn(name = "team_id", referencedColumnName = "id")
    private Team team;

    @ManyToOne
    @JoinColumn(name = "race_id", referencedColumnName = "id")
    private Race race;

    @ManyToOne
    @JoinColumn(name = "season_id", referencedColumnName = "id")
    private Season season;
}
