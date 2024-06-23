package formula.bollo.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "fantasy_election")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class FantasyElection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Account user;

    @ManyToOne
    @JoinColumn(name = "driver_one_id", referencedColumnName = "id")
    private Driver driverOne;

    @ManyToOne
    @JoinColumn(name = "driver_two_id", referencedColumnName = "id")
    private Driver driverTwo;

    @ManyToOne
    @JoinColumn(name = "driver_three_id", referencedColumnName = "id")
    private Driver driverThree;

    @ManyToOne
    @JoinColumn(name = "team_one_id", referencedColumnName = "id")
    private Team teamOne;

    @ManyToOne
    @JoinColumn(name = "team_two_id", referencedColumnName = "id")
    private Team teamTwo;

    @ManyToOne
    @JoinColumn(name = "race_id", referencedColumnName = "id")
    private Race race;

    @ManyToOne
    @JoinColumn(name = "season_id", referencedColumnName = "id")
    private Season season;
}
