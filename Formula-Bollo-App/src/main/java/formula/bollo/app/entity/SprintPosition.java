package formula.bollo.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;

import lombok.Data;

@Entity
@Table(name = "sprint_position")
@Data
public class SprintPosition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "position_number", unique = true, nullable = false, length = 6)
    private int positionNumber;

    @Column(name = "points", nullable = false, length = 6)
    private int points;
}
