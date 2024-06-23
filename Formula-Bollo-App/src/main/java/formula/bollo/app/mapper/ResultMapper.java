package formula.bollo.app.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Result;
import formula.bollo.app.model.ResultDTO;

@Component
public interface ResultMapper {
    Result resultDTOToResult(ResultDTO resultDTO);

    ResultDTO resultToResultDTO(Result result);

    List<ResultDTO> convertResultsToResultsDTO(List<Result> results);
}
