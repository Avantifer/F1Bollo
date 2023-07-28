package formula.bollo.app.impl;

import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.TeamDTO;
import formula.bollo.app.utils.Log;

@Component
public class DriverImpl implements DriverMapper {


    /**
     * Map DriverDTO to return an object type Driver
     * @param driverDTO
     * @exception SQLException Cannot do something with the db
     * @exception IllegalArgumentException Cannot convert string to byte[]
     * @return class Driver with DriverDTO properties
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

        return driver;
    }

    /**
     * Map Driver to return an object type DriverDTO
     * @param driver
     * @exception SQLException Cannot do something with the db
     * @return class DriverDTO with Driver properties
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
            TeamDTO teamDTO = new TeamDTO();
            teamDTO.setId(driver.getTeam().getId());
            teamDTO.setName(driver.getTeam().getName());
            driverDTO.setTeam(teamDTO);
            driverDTO.setDriverImage(driverImage);
        } catch (SQLException e) {
            Log.error("No se ha podido obtener la base64 del blob: ", e);
        }

        return driverDTO;
    }

    /**
     * Map Driver to return an object type DriverDTO
     * @param driver
     * @exception SQLException Cannot do something with the db
     * @return class DriverDTO with Driver properties
    */
    @Override
    public DriverDTO driverToDriverDTONoImage(Driver driver) {
        DriverDTO driverDTO = new DriverDTO();
        BeanUtils.copyProperties(driver, driverDTO);
        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId(driver.getTeam().getId());
        teamDTO.setName(driver.getTeam().getName());
        driverDTO.setTeam(teamDTO);

        return driverDTO;
    }
}
