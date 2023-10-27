package formula.bollo.app.entity;

import java.sql.Blob;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

import lombok.Data;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.GenerationType;

@Entity
@Table(name = "team")
@Data
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 50)
    @NotNull
    private String name;

    @Column(name = "car_image", nullable = false)
    @NotNull
    private String carImage;
    
    @JsonIgnore
    @Column(name = "team_image", nullable = false, columnDefinition = "BLOB")
    @NotNull
    private Blob teamImage;

    @Column(name = "logo_image", nullable = false, length = 250)
    @NotNull
    private String logoImage;

    @ManyToOne
    @JoinColumn(name = "season_id")
    private Season season;
}
