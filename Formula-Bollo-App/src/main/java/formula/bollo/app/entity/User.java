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
import lombok.Data;

@Entity
@Table(name = "user")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username", unique = true, nullable = false, length = 10)
    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String username;

    @Column(name = "password", nullable = false, length = 100)
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    @Column(name = "admin", nullable = false, length = 1)
    private int admin;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;
}
