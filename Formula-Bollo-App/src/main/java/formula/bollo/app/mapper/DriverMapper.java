package formula.bollo.app.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.model.DriverDTO;

@Component
public interface DriverMapper {
    Driver driverDTOToDriver(DriverDTO driverDTO);

    DriverDTO driverToDriverDTO(Driver driver);

    DriverDTO driverToDriverDTONoImage(Driver driver);

    List<DriverDTO> convertDriversToDriverDTO(List<Driver> drivers);
}
