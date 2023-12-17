package formula.bollo.app.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.Comparator;

import org.springframework.stereotype.Service;

import formula.bollo.app.entity.FantasyPointsDriver;
import formula.bollo.app.entity.FantasyPointsTeam;
import formula.bollo.app.entity.FantasyPriceDriver;
import formula.bollo.app.entity.FantasyPriceTeam;
import formula.bollo.app.entity.Race;
import formula.bollo.app.entity.Result;
import formula.bollo.app.entity.Season;
import formula.bollo.app.repository.FantasyPointsDriverRepository;
import formula.bollo.app.repository.FantasyPriceDriverRepository;
import formula.bollo.app.utils.Log;

@Service
public class FantasyService {
    
    private FantasyPriceDriverRepository fantasyPriceRepository;

    private FantasyPointsDriverRepository fantasyPointsRepository;

    public FantasyService(FantasyPriceDriverRepository fantasyPriceRepository, FantasyPointsDriverRepository fantasyPointsRepository) {
        this.fantasyPriceRepository = fantasyPriceRepository;
        this.fantasyPointsRepository = fantasyPointsRepository;
    }

    /**
     * Calculates the points for a driver based on the given result.
     *
     * @param result The result of the race.
     * @param resultsSize The total number of results in the race.
     * @return The calculated points for the fantasy race.
    */
    public int calculatePoints(Result result, int resultsSize) {
        int points = 0;

        // Get the pole position gives 3 points
        if (result.getPole() == 1) points += 3;
        
        if (result.getPosition() ==  null) return points;
        
        // Get the fastest lap gives 1 point
        if (result.getFastlap() == 1) points += 1;

        Boolean goodPosition = false;

        // Depends on the position gives points
        switch (result.getPosition().getPositionNumber()) {
            case 1:
                points += 10;
                goodPosition = true;
                break;
            case 2:
                points += 9;
                goodPosition = true;
                break;
            case 3:
                points += 8;
                goodPosition = true;
                break;
            case 4:
                points += 7;
                goodPosition = true;
                break;
            case 5:
                points += 6;
                goodPosition = true;
                break;
            case 6:
                points += 5;
                goodPosition = true;
                break;
            case 7:
                points += 4;
                goodPosition = true;
                break;
            case 8:
                points += 3;
                goodPosition = true;
                break;
            case 9:
                points += 2;
                goodPosition = true;
                break;
            case 10:
                points += 1;
                goodPosition = true;
                break;
            default:
                break;
        }

        
        List<FantasyPriceDriver> fantasyPrices = this.fantasyPriceRepository.findByRaceId(result.getRace().getId());

        FantasyPriceDriver fantasyPrice = fantasyPrices.stream()
            .filter(fp -> fp.getDriver().getId().equals(result.getDriver().getId()))
            .findFirst()
            .orElse(null);

        if (fantasyPrice == null) return -1;
        
        int priceDriver = fantasyPrice.getPrice();

        // Get the driver with the lowest price (< 10) gives 8 points
        if (priceDriver < 10 && goodPosition) points += 8;
        
        // Get the medium drivers (between 20 and 10) gives 3 points
        if (priceDriver <= 20 && priceDriver >= 10 && goodPosition) points += 3;
        
        // Depends on the number of drivers finished the race gives points
        int multiplier = (resultsSize / 10) < 1 ? 1 : (resultsSize / 10); 
        points *= multiplier;

        return points;
    }

    /**
     * Creates a list of FantasyPointsDriver objects based on the provided list of Result objects.
     * @param results A list of Result objects containing race and driver information.
     * @return A list of FantasyPointsDriver objects with calculated fantasy points for each driver in the results.
    */
    public List<FantasyPointsDriver> createDriversPoints(List<Result> results) {
        List<FantasyPointsDriver> fantasyPoints = new ArrayList<>();

        boolean pointsProblem = false;

        for (Result result: results) {
            FantasyPointsDriver fantasyPoint = new FantasyPointsDriver();
            fantasyPoint.setDriver(result.getDriver());
            fantasyPoint.setRace(result.getRace());
            fantasyPoint.setSeason(result.getSeason());
            fantasyPoint.setPoints(this.calculatePoints(result, results.size()));
            if (fantasyPoint.getPoints() == -1) pointsProblem = true;
            fantasyPoints.add(fantasyPoint);
        }

        if (pointsProblem) return new ArrayList<>();

        return fantasyPoints;
    }

    /**
     * Creates a list of FantasyPointsTeam objects based on the provided list of FantasyPointsDriver objects.
     * @param driversPoints A list of FantasyPointsDriver objects containing driver-specific fantasy points.
     * @return A list of FantasyPointsTeam objects with calculated total fantasy points for each team.
    */
    public List<FantasyPointsTeam> createTeamsPoints(List<FantasyPointsDriver> driversPoints) {
        Season season = driversPoints.get(0).getSeason();
        Race race = driversPoints.get(0).getRace();

        return driversPoints.stream()
            .collect(Collectors.groupingBy(
                fantasyPointsDriverDTO -> fantasyPointsDriverDTO.getDriver().getTeam(),
                Collectors.summingDouble(driver -> Objects.requireNonNullElse(driver.getPoints(), 0))
            ))
            .entrySet()
            .stream()
            .map(entry -> {
                FantasyPointsTeam fantasyPointsTeam = new FantasyPointsTeam();
                fantasyPointsTeam.setTeam(entry.getKey());
                fantasyPointsTeam.setPoints((int) Math.round(entry.getValue() / 2));
                fantasyPointsTeam.setRace(race);
                fantasyPointsTeam.setSeason(season);
                return fantasyPointsTeam;
            })
            .sorted(Comparator.comparingInt(FantasyPointsTeam::getPoints).reversed())
            .collect(Collectors.toList());
    }

    /**
     * Calculates and returns the new price for a driver based on the provided race result.
     * @param result The race result containing information about the driver and the race.
     * @return The calculated new price for the driver. If there is an issue with calculation, returns BigDecimal.ZERO.
    */
    public int calculateDriverPrice(Result result) {
        List<FantasyPriceDriver> fantasyPrices = this.fantasyPriceRepository.findByRaceId(result.getRace().getId());
        FantasyPriceDriver fantasyPrice = fantasyPrices.stream()
            .filter(fp -> Objects.equals(fp.getDriver().getId(), result.getDriver().getId()))
            .findFirst()
            .orElse(null);

        if (fantasyPrice == null) return -1;

        int newPrice = fantasyPrice.getPrice();

        List<FantasyPointsDriver> fantasyPoints = this.fantasyPointsRepository.findByRaceId(result.getRace().getId());
        FantasyPointsDriver fantasyPoint = fantasyPoints.stream()
            .filter(fp -> Objects.equals(fp.getDriver().getId(), result.getDriver().getId()))
            .findFirst()
            .orElse(null);
        
        int maxPrice = 30000000;
        int minPrice = 1000000;
        
        // Calcular el nuevo precio
        if (fantasyPoint == null) return -1;

        int points = fantasyPoint.getPoints();
        if (points == 0) {
            newPrice = adjustPriceForZeroPoints(newPrice);
        } else {                
            newPrice += (points / 10) * minPrice;
        }

        // Si el nuevo precio es menor que 1, el precio es 1; si es mayor que 30, el precio es 30
        if (newPrice <= minPrice) {
            newPrice = minPrice;
        }
        if (newPrice >= maxPrice) {
            newPrice = maxPrice;
        }

        return newPrice;
    }

    /**
     * Adjusts the given price based on specific price groups and their corresponding multipliers.
     * @param newPrice The price to be adjusted based on price groups and multipliers.
     * @return         The adjusted price as an integer.
    */
    private int adjustPriceForZeroPoints(int newPrice) {
        final int PRICE_GROUP_1 = 20000000;
        final int PRICE_GROUP_2 = 10000000;
        final int PRICE_GROUP_3 = 1000000;

        final double PRICE_MULTIPLIER_1 = 0.90;
        final double PRICE_MULTIPLIER_2 = 0.80;
        final double PRICE_MULTIPLIER_3 = 0.70;

        if (newPrice >= PRICE_GROUP_1) {
            return applyMultiplier(newPrice, PRICE_MULTIPLIER_1);
        } else if (newPrice >= PRICE_GROUP_2) {
            return applyMultiplier(newPrice, PRICE_MULTIPLIER_2);
        } else if (newPrice >= PRICE_GROUP_3) {
            return applyMultiplier(newPrice, PRICE_MULTIPLIER_3);
        }

        return newPrice;
    }

    /**
     * Applies a multiplier to the provided price and returns the result as an integer.
     * @param price      The price to which the multiplier will be applied.
     * @param multiplier The multiplier to be applied to the price.
     * @return           The result of the multiplication converted to an integer.
    */
    private int applyMultiplier(int price, double multiplier) {
        return (int) (price * multiplier);
    }

    /**
     * Creates a list of FantasyPriceDriver objects based on the provided list of race results and the next race.
     * @param results A list of Result objects containing race and driver information.
     * @param nextRace The next race for which the prices are being calculated.
     * @return A list of FantasyPriceDriver objects with calculated prices for each driver in the results.
    */
    public List<FantasyPriceDriver> createDriversPrices(List<Result> results, Race nextRace) {
        List<FantasyPriceDriver> fantasydriverPrices = new ArrayList<>();

        boolean pricesProblem = false;

        for (Result result: results) {
            FantasyPriceDriver fantasyPriceDriver = new FantasyPriceDriver();
            fantasyPriceDriver.setDriver(result.getDriver());
            fantasyPriceDriver.setRace(nextRace);
            fantasyPriceDriver.setSeason(result.getSeason());
            fantasyPriceDriver.setPrice(this.calculateDriverPrice(result));

            if (fantasyPriceDriver.getPrice() == -1) pricesProblem = true;

            fantasydriverPrices.add(fantasyPriceDriver);
        }
        Log.info("Pilotos -> " + fantasydriverPrices);

        if (pricesProblem) return new ArrayList<>();

        return fantasydriverPrices;
    }

    /**
     * Creates a list of FantasyPriceTeam objects based on the provided list of FantasyPriceDriver objects and the next race.
     * @param driversPrices A list of FantasyPriceDriver objects containing driver-specific prices.
     * @param nextRace The next race for which the prices are being calculated.
     * @return A list of FantasyPriceTeam objects with calculated total prices for each team.
    */
    public List<FantasyPriceTeam> createTeamsPrices(List<FantasyPriceDriver> driversPrices, Race nextRace) {     
        Season season = driversPrices.get(0).getSeason();
        return driversPrices.stream()
            .collect(Collectors.groupingBy(
                fantasyPriceDriverDTO -> fantasyPriceDriverDTO.getDriver().getTeam(),
                Collectors.summingDouble(FantasyPriceDriver::getPrice)
            ))
            .entrySet()
            .stream()
            .map(entry -> {
                FantasyPriceTeam fantasyPriceTeam = new FantasyPriceTeam();
                fantasyPriceTeam.setTeam(entry.getKey());
                fantasyPriceTeam.setPrice((int) Math.round(entry.getValue() / 2));
                fantasyPriceTeam.setRace(nextRace);
                fantasyPriceTeam.setSeason(season);
                return fantasyPriceTeam;
            })
            .sorted(Comparator.comparingDouble((FantasyPriceTeam::getPrice)))
            .collect(Collectors.toList());
    }
}