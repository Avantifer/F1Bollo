package formula.bollo.app.controller;


import formula.bollo.app.entity.PenaltySeverity;
import formula.bollo.app.mapper.PenaltySeverityMapper;
import formula.bollo.app.model.PenaltySeverityDTO;
import formula.bollo.app.repository.PenaltySeverityRepository;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://192.168.1.135:4200")
@RestController
@RequestMapping(path = {Constants.ENDPOINT_PENALTY_SEVERITY}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_PENALTY_SEVERITY, description = Constants.TAG_PENALTY_SEVERITY_SUMMARY)
public class PenaltySeverityController {

    private PenaltySeverityRepository penaltySeverityRepository;
    private PenaltySeverityMapper penaltySeverityMapper;

    public PenaltySeverityController(PenaltySeverityRepository penaltySeverityRepository, PenaltySeverityMapper penaltySeverityMapper) {
        this.penaltySeverityRepository = penaltySeverityRepository;
        this.penaltySeverityMapper = penaltySeverityMapper;
    }

    @Operation(summary = "Get all penalties severities", tags = Constants.TAG_PENALTY_SEVERITY)
    @GetMapping("/all")
    public List<PenaltySeverityDTO> getAllPenaltiesSeverity() {
        Log.info("START - getAllPenaltiesSeverity - START");
        
        List<PenaltySeverity> penaltiesSeverities = penaltySeverityRepository.findAll();
        List<PenaltySeverityDTO> penaltySeveritiesDTOs = new ArrayList<>();

        if (penaltiesSeverities.isEmpty()) return penaltySeveritiesDTOs;
        penaltySeveritiesDTOs = penaltySeverityMapper.convertPenaltiesSeverityToPenaltiesSeverityDTO(penaltiesSeverities);
        
        Log.info("END - getAllPenaltiesSeverity - END");

        return penaltySeveritiesDTOs;
    }
}
