package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.herooo.mylanguagedb.entities.Country;
import ru.herooo.mylanguageweb.dto.entity.country.CountryMapping;
import ru.herooo.mylanguageweb.dto.entity.country.CountryResponseDTO;
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;
import ru.herooo.mylanguageweb.services.CountryService;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
public class CountriesRestController {
    private final CountryService COUNTRY_SERVICE;

    private final CountryMapping COUNTRY_MAPPING;

    @Autowired
    public CountriesRestController(CountryService countryService,
                                   CountryMapping countryMapping) {
        this.COUNTRY_SERVICE = countryService;

        this.COUNTRY_MAPPING = countryMapping;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Country> countries = COUNTRY_SERVICE.findAll();
        if (countries != null && countries.size() > 0) {
            List<CountryResponseDTO> responseDTOs = countries
                    .stream()
                    .map(COUNTRY_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Страны не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_code")
    public ResponseEntity<?> find(@RequestParam("code") String code) {
        Country country = COUNTRY_SERVICE.find(code);
        if (country != null) {
            CountryResponseDTO dto = COUNTRY_MAPPING.mapToResponseDTO(country);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Страна с кодом '%s' не найдена.", code));
            return ResponseEntity.badRequest().body(message);
        }
    }
}
