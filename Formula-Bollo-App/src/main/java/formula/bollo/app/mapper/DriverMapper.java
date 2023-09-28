package formula.bollo.app.mapper;

import java.util.List;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.model.DriverDTO;

@Component
public interface DriverMapper {
    
    TeamMapper INSTANCE = Mappers.getMapper(TeamMapper.class);

    Driver driverDTOToDriver(DriverDTO driverDTO);

    DriverDTO driverToDriverDTO(Driver driver);

    DriverDTO driverToDriverDTONoImage(Driver driver);

    List<DriverDTO> convertDriversToDriverDTONoImage(List<Driver> drivers);
}
