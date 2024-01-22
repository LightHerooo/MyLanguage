package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypes;
import ru.herooo.mylanguageweb.controllers.move.Redirects;
import ru.herooo.mylanguageweb.controllers.move.Views;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WorkoutTypeService;

@Controller
@RequestMapping("/workouts")
public class WorkoutsController {

    private final String WORKOUT_TYPE_ATTRIBUTE_NAME = "WORKOUT_TYPE";

    private final CustomerService CUSTOMER_SERVICE;
    private final WorkoutTypeService WORKOUT_TYPE_SERVICE;

    private final ControllerUtils CONTROLLER_UTILS;

    @Autowired
    public WorkoutsController(CustomerService customerService,
                              WorkoutTypeService workoutTypeService,

                              ControllerUtils controllerUtils) {
        this.CUSTOMER_SERVICE = customerService;
        this.WORKOUT_TYPE_SERVICE = workoutTypeService;

        this.CONTROLLER_UTILS = controllerUtils;
    }

    @GetMapping
    public String showWorkoutsPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.findAuth(request);
        if (authCustomer != null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

            return Views.WORKOUTS_SHOW.PATH_TO_FILE;
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/random_words")
    public String showRandomWordsPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.findAuth(request);
        if (authCustomer != null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);
            request.setAttribute(WORKOUT_TYPE_ATTRIBUTE_NAME,
                    WORKOUT_TYPE_SERVICE.findById(WorkoutTypes.RANDOM_WORDS));

            return Views.WORKOUTS_RANDOM_WORDS.PATH_TO_FILE;
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }
}
