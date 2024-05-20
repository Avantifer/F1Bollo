package formula.bollo.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Blob;

@Entity
@Table(name = "circuit")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Circuit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false, length = 50)
    @NotBlank(message = "El nombre del circuito es obligatorio")
    private String name;

    @Column(name = "country", nullable = false, length = 30)
    @NotBlank(message = "El país del circuito es obligatorio")
    private String country;

    @Column(name = "flag_image", columnDefinition = "BLOB", nullable = true)
    private Blob flagImage;
    
    @Column(name = "circuit_image", columnDefinition = "BLOB", nullable = true)
    private Blob circuitImage;

    @ManyToOne
    @JoinColumn(name = "season_id", referencedColumnName = "id")
    private Season season;
}
