package formula.bollo.app.impl;

import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Circuit;
import formula.bollo.app.mapper.CircuitMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.model.CircuitDTO;
import formula.bollo.app.utils.Log;

@Component
public class CircuitImpl implements CircuitMapper{

    private SeasonMapper seasonMapper;

    public CircuitImpl(SeasonMapper seasonMapper) {
        this.seasonMapper = seasonMapper;
    }

    /**
     * Converts a CircuitDTO object to a Circuit object.
     *
     * @param circuitDTO The CircuitDTO object to be converted.
     * @return           A Circuit object with properties copied from the CircuitDTO.
    */
    @Override
    public Circuit circuitDTOToCircuit(CircuitDTO circuitDTO) {
        Circuit circuit = new Circuit();

        try {
            byte[] decodedByteFlagImage = Base64.getDecoder().decode(circuitDTO.getFlagImage());
            Blob flagImage = new SerialBlob(decodedByteFlagImage);

            byte[] decodedByteCircuitImage = Base64.getDecoder().decode(circuitDTO.getCircuitImage());
            Blob circuitImage = new SerialBlob(decodedByteCircuitImage);

            BeanUtils.copyProperties(circuitDTO, circuit);
            circuit.setFlagImage(flagImage);
            circuit.setCircuitImage(circuitImage);
        } catch (SQLException | IllegalArgumentException e) {
            Log.error("No se ha podido obtener el blob de base64: ", e);
        }

        circuit.setSeason(this.seasonMapper.seasonDTOToSeason(circuitDTO.getSeason()));

        return circuit;
    }

    /**
     * Converts a Circuit object to a CircuitDTO object.
     *
     * @param circuit The Circuit object to be converted.
     * @return        A CircuitDTO object with properties copied from the Circuit.
    */ 
    @Override
    public CircuitDTO circuitToCircuitDTO(Circuit circuit) {
        CircuitDTO circuitDTO = new CircuitDTO();

        try {
            String flagImage = "";
            String circuitImage = "";

            if (circuit.getFlagImage() != null) {
                flagImage = Base64.getEncoder().encodeToString(circuit.getFlagImage().getBytes(1, (int) circuit.getFlagImage().length()));
            }

            if (circuit.getCircuitImage() != null) {
                circuitImage = Base64.getEncoder().encodeToString(circuit.getCircuitImage().getBytes(1, (int) circuit.getCircuitImage().length()));
            }

            BeanUtils.copyProperties(circuit, circuitDTO);
            circuitDTO.setFlagImage(flagImage);
            circuitDTO.setCircuitImage(circuitImage);
        } catch (SQLException e) {
            Log.error("No se ha podido obtener la base64 del blob: ", e);
        }
        
        circuitDTO.setSeason(this.seasonMapper.seasonToSeasonDTO(circuit.getSeason()));
        
        return circuitDTO;
    }
}
