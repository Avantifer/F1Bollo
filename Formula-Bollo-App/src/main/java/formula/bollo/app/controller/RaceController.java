package formula.bollo.app.controller;

import formula.bollo.app.entity.Race;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.repository.RaceRepository;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "https://formulabollo.es")
@RestController
@RequestMapping(path = {"/races"}, produces = MediaType.APPLICATION_JSON_VALUE)
public class RaceController {
    
    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceMapper raceMapper;


    @Operation(summary = "Get races per circuit")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Races successfully obtained"),
        @ApiResponse(code = 404, message = "Races cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/racesPerCircuit")
    public List<RaceDTO> getRacesPerCircuit(@RequestParam("circuitId") Integer circuitId) {
        List<RaceDTO> raceDTOs = new ArrayList<>();
        List<Race> races = raceRepository.findByCircuitId((long) circuitId);

        if (races.isEmpty()) {
            return raceDTOs;
        }

        for(Race race : races) {
            raceDTOs.add(raceMapper.raceToRaceDTO(race));
        }

        return raceDTOs;
    }

    @Operation(summary = "Save a race")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Races successfully saved"),
        @ApiResponse(code = 404, message = "Races cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @PutMapping(path = "/saveRace", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> saveCircuit(@RequestBody RaceDTO raceDTO) {
        try {
            List<Race> existingRace = raceRepository.findByCircuitId(raceDTO.getCircuit().getId());
            if (existingRace.isEmpty()) {
                Race newRace = raceMapper.raceDTOToRace(raceDTO);
                raceRepository.save(newRace);            
            } else {
                Race raceToUpdate = raceMapper.raceDTOToRace(raceDTO);
                raceToUpdate.setId(existingRace.get(0).getId());
                raceRepository.saveAndFlush(raceToUpdate);
            }
        } catch (DataAccessException e) {
            return new ResponseEntity<>("Hubo un problema con la base de datos", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("Error inesperado. Contacta con el administrados", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>("Carrera guardada correctamente", HttpStatus.OK);
    }
}