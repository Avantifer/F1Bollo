package formula.bollo.app.impl;

import java.sql.Blob;
import java.sql.SQLException;
import javax.sql.rowset.serial.SerialBlob;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.mapper.TeamMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.TeamDTO;
import formula.bollo.app.utils.Log;

@Component
public class DriverImpl implements DriverMapper {

    private SeasonMapper seasonMapper;
    private TeamMapper teamMapper;

    public DriverImpl(SeasonMapper seasonMapper, TeamMapper teamMapper) {
        this.seasonMapper = seasonMapper;
        this.teamMapper = teamMapper;
    }

    /**
     * Converts a DriverDTO object to a Driver object.
     *
     * @param driverDTO The DriverDTO object to be converted.
     * @return          A Driver object with properties copied from the DriverDTO.
    */
    @Override
    public Driver driverDTOToDriver(DriverDTO driverDTO) {
        Driver driver = new Driver();

        try {
            BeanUtils.copyProperties(driverDTO, driver);

            if (driverDTO.getDriverImage() == null) return driver;

            byte[] decodedByte = Base64.getDecoder().decode(driverDTO.getDriverImage());
            Blob driverImage = new SerialBlob(decodedByte);
            driver.setDriverImage(driverImage);
        } catch (SQLException | IllegalArgumentException e) {
            Log.error("No se ha podido obtener el blob de base64: ", e);
        }
        
        driver.setSeason(this.seasonMapper.seasonDTOToSeason(driverDTO.getSeason()));
        
        return driver;
    }

    /**
     * Converts a Driver object to a DriverDTO object.
     *
     * @param driver The Driver object to be converted.
     * @return       A DriverDTO object with properties copied from the Driver.
    */
    @Override
    public DriverDTO driverToDriverDTO(Driver driver) {
        DriverDTO driverDTO = new DriverDTO();

        try {
            String driverImage = "";
            if (driver.getDriverImage() != null) {
                driverImage = Base64.getEncoder().encodeToString(driver.getDriverImage().getBytes(1, (int) driver.getDriverImage().length()));
            }
            BeanUtils.copyProperties(driver, driverDTO);
            driverDTO.setDriverImage(driverImage);
        } catch (SQLException e) {
            Log.error("No se ha podido obtener la base64 del blob: ", e);
        }

        driverDTO.setTeam(this.teamMapper.teamToTeamDTO(driver.getTeam()));
        driverDTO.setSeason(this.seasonMapper.seasonToSeasonDTO(driver.getSeason()));

        return driverDTO;
    }

    /**
     * Converts a Driver object to a DriverDTO object without including the driver image.
     *
     * @param driver The Driver object to be converted.
     * @return       A DriverDTO object with properties copied from the Driver (excluding driver image).
    */
    @Override
    public DriverDTO driverToDriverDTONoImage(Driver driver) {
        DriverDTO driverDTO = new DriverDTO();
        BeanUtils.copyProperties(driver, driverDTO);
        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId(driver.getTeam().getId());
        teamDTO.setName(driver.getTeam().getName());
        driverDTO.setTeam(teamDTO);
        driverDTO.setSeason(this.seasonMapper.seasonToSeasonDTO(driver.getSeason()));
        
        return driverDTO;
    }

    /**
     * Converts a list of Driver objects to a list of DriverDTO objects.
     *
     * @param drivers The list of Driver objects to be converted.
     * @return        A list of DriverDTO objects with properties copied from the Drivers.
    */
    @Override
    public List<DriverDTO> convertDriversToDriverDTO(List<Driver> drivers) {
        return drivers.parallelStream()
                .map(this::driverToDriverDTO)
                .collect(Collectors.toList());
    }
}
