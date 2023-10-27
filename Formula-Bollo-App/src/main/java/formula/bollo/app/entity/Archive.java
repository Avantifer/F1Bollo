package formula.bollo.app.entity;

import java.sql.Blob;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.Entity;

import lombok.Data;

@Entity
@Table(name = "archive")
@Data
public class Archive {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "file", columnDefinition = "LONGBLOB", nullable = false)
    private Blob file;

    @Column(name = "extension", nullable = false, length = 100)
    @NotBlank(message = "La extensión del fichero es obligatoria")
    private String extension;

    @Column(name = "definition", unique = true, nullable = false, length = 100)
    @NotBlank(message = "La definición es obligatoria")
    private String definition;
}
