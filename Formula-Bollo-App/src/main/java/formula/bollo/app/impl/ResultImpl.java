package formula.bollo.app.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Result;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.PositionMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.mapper.ResultMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.model.ResultDTO;

@Component
public class ResultImpl implements ResultMapper {
    
    private RaceMapper raceMapper;
    private DriverMapper driverMapper;
    private PositionMapper positionMapper;
    private SeasonMapper seasonMapper;

    public ResultImpl(
        RaceMapper raceMapper,
        DriverMapper driverMapper,
        PositionMapper positionMapper,
        SeasonMapper seasonMapper
    ) {
        this.raceMapper = raceMapper;
        this.driverMapper = driverMapper;
        this.positionMapper = positionMapper;
        this.seasonMapper = seasonMapper;
    }

    /**
     * Converts a ResultDTO object to a Result object.
     *
     * @param resultDTO The ResultDTO object to be converted.
     * @return          A Result object with properties copied from the ResultDTO.
    */
    @Override
    public Result resultDTOToResult(ResultDTO resultDTO) {
        Result result = new Result();
        BeanUtils.copyProperties(resultDTO, result);
        result.setRace(raceMapper.raceDTOToRace(resultDTO.getRace()));
        result.setDriver(driverMapper.driverDTOToDriver(resultDTO.getDriver()));

        if (result.getPosition() != null) {
            result.setPosition(positionMapper.positionDTOToPosition(resultDTO.getPosition()));
        }

        result.setSeason(this.seasonMapper.seasonDTOToSeason(resultDTO.getSeason()));
        
        return result;
    }

    /**
     * Converts a Result object to a ResultDTO object.
     *
     * @param result The Result object to be converted.
     * @return       A ResultDTO object with properties copied from the Result.
    */
    @Override
    public ResultDTO resultToResultDTO(Result result) {
        ResultDTO resultDTO = new ResultDTO();
        BeanUtils.copyProperties(result, resultDTO);
        resultDTO.setRace(raceMapper.raceToRaceDTO(result.getRace()));
        resultDTO.setDriver(driverMapper.driverToDriverDTONoImage(result.getDriver()));
        
        if (result.getPosition() != null) {
            resultDTO.setPosition(positionMapper.positionToPositionDTO(result.getPosition()));
        }

        resultDTO.setSeason(this.seasonMapper.seasonToSeasonDTO(result.getSeason()));

        return resultDTO;
    }

    /**
     * Converts a list of Result objects to a list of ResultDTO objects.
     *
     * @param results The list of Result objects to be converted.
     * @return        A list of ResultDTO objects with properties copied from the Results.
    */
    @Override
    public List<ResultDTO> convertResultsToResultsDTO(List<Result> results) {
        return results.parallelStream()
                .map(this::resultToResultDTO)
                .collect(Collectors.toList());
    }
}
