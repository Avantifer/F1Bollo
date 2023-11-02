package formula.bollo.app.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import formula.bollo.app.utils.Constants;

@CrossOrigin(origins = Constants.PRODUCTION_FRONTEND)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_DRIVER}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_DRIVER, description = Constants.TAG_DRIVER_SUMMARY)
public class FantasyElectionController {
    
    
}
