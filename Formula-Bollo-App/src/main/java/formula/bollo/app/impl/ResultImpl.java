package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Result;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.PositionMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.mapper.ResultMapper;
import formula.bollo.app.model.ResultDTO;

@Component
public class ResultImpl implements ResultMapper {
    
    @Autowired
    private RaceMapper raceMapper;

    @Autowired
    private DriverMapper driverMapper;

    @Autowired
    private PositionMapper positionMapper;

    /**
     * Map ResultDTO to return an object type Result
     * @param ResultDTO
     * @return class Result with ResultDTO properties
    */
    @Override
    public Result resultDTOToResult(ResultDTO resultDTO) {
        Result result = new Result();
        BeanUtils.copyProperties(resultDTO, result);
        result.setId(resultDTO.getId());      
        result.setRace(raceMapper.raceDTOToRace(resultDTO.getRace()));
        result.setDriver(driverMapper.driverDTOToDriver(resultDTO.getDriver()));

        if (result.getPosition() != null) {
            result.setPosition(positionMapper.positionDTOToPosition(resultDTO.getPosition()));
        }

        return result;
    }

    /**
     * Map Result to return an object type ResultDTO
     * @param result
     * @return class ResultDTO with Result properties
    */
    @Override
    public ResultDTO resultToResultDTO(Result result) {
        ResultDTO resultDTO = new ResultDTO();

        resultDTO.setId(result.getId());      
        resultDTO.setRace(raceMapper.raceToRaceDTO(result.getRace()));
        resultDTO.setDriver(driverMapper.driverToDriverDTONoImage(result.getDriver()));
        if (result.getPosition() != null) {
            resultDTO.setPosition(positionMapper.positionToPositionDTO(result.getPosition()));
        }

        resultDTO.setFastlap(result.getFastlap());
        return resultDTO;
    }
}
