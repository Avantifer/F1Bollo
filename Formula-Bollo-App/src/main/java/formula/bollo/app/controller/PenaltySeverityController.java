package formula.bollo.app.controller;


import formula.bollo.app.entity.PenaltySeverity;
import formula.bollo.app.mapper.PenaltySeverityMapper;
import formula.bollo.app.model.PenaltySeverityDTO;
import formula.bollo.app.repository.PenaltySeverityRepository;

import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "https://formulabollo.es")
@RestController
@RequestMapping(path = {"/penaltiesSeverity"}, produces = MediaType.APPLICATION_JSON_VALUE)
public class PenaltySeverityController {
    
    @Autowired
    private PenaltySeverityRepository penaltySeverityRepository;

    @Autowired
    private PenaltySeverityMapper penaltySeverityMapper;


    @Operation(summary = "Get all penalties severities")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Penalties severities successfully obtained"),
        @ApiResponse(code = 404, message = "Penalties severities cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/all")
    public List<PenaltySeverityDTO> getAll() {
        List<PenaltySeverity> penaltiesSeverities = penaltySeverityRepository.findAll();
        List<PenaltySeverityDTO> penaltySeveritiesDTOs = new ArrayList<>();

        for (PenaltySeverity penaltySeverity : penaltiesSeverities) {
            penaltySeveritiesDTOs.add(penaltySeverityMapper.penaltySeverityToPenaltySeverityDTO(penaltySeverity));
        }

        return penaltySeveritiesDTOs;
    }
}
