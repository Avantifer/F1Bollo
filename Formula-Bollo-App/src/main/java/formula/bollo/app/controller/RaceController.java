package formula.bollo.app.controller;

import formula.bollo.app.entity.Race;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.repository.RaceRepository;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
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
@Tag(name = "Races", description = "Operations related with races")
public class RaceController {
    
    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceMapper raceMapper;


    @Operation(summary = "Get races per circuit", tags = "Races")
    @GetMapping("/circuit")
    public List<RaceDTO> getRacesPerCircuit(@RequestParam("circuitId") Integer circuitId) {
        Log.info("START - getRacesPerCircuit - START");
        Log.info("RequestParam getRacesPerCircuit (circuitId) -> " + circuitId);

        List<RaceDTO> raceDTOs = new ArrayList<>();
        List<Race> races = raceRepository.findByCircuitId((long) circuitId);
        
        if (races.isEmpty()) {
            return raceDTOs;
        }
        
        for(Race race : races) {
            raceDTOs.add(raceMapper.raceToRaceDTO(race));
        }
        
        Log.info("END - getRacesPerCircuit - END");

        return raceDTOs;
    }

    @Operation(summary = "Save a race", tags = "Races")
    @PutMapping(path = "/save", produces = MediaType.TEXT_PLAIN_VALUE, consumes = "application/json")
    public ResponseEntity<String> saveCircuit(@RequestBody RaceDTO raceDTO) {
        Log.info("START - saveCircuit - START");
        Log.info("RequestBody saveCircuit -> " + raceDTO);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        
        try {
            List<Race> existingRace = raceRepository.findByCircuitId(raceDTO.getCircuit().getId());
            if (existingRace.isEmpty()) {
                Race newRace = raceMapper.raceDTOToRace(raceDTO);
                raceRepository.save(newRace);            
            } else {
                Race raceToUpdate = raceMapper.raceDTOToRace(raceDTO);
                raceToUpdate.setId(existingRace.get(0).getId());
                raceRepository.save(raceToUpdate);
            }
        } catch (DataAccessException e) {
            return new ResponseEntity<>("Hubo un problema con la base de datos", headers, HttpStatusCode.valueOf(500));
        } catch (Exception e) {
            return new ResponseEntity<>("Error inesperado. Contacta con el administrados", headers, HttpStatusCode.valueOf(500));
        }
        
        Log.info("END - saveCircuit - END");

        return new ResponseEntity<>("Carrera guardada correctamente", headers, HttpStatusCode.valueOf(200));
    }
}