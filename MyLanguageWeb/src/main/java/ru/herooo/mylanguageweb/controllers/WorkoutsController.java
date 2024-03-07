package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Workout;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypes;
import ru.herooo.mylanguageweb.controllers.move.Redirects;
import ru.herooo.mylanguageweb.controllers.move.Views;
import ru.herooo.mylanguageweb.global.GlobalCookieUtils;
import ru.herooo.mylanguageweb.global.GlobalCookies;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WorkoutService;
import ru.herooo.mylanguageweb.services.WorkoutTypeService;

@Controller
@RequestMapping("/workouts")
public class WorkoutsController {
    private final String WORKOUT_TYPE_ATTRIBUTE_NAME = "WORKOUT_TYPE";
    private final String WORKOUT_ID_ATTRIBUTE_NAME = "WORKOUT_ID";

    private final CustomerService CUSTOMER_SERVICE;
    private final WorkoutTypeService WORKOUT_TYPE_SERVICE;
    private final WorkoutService WORKOUT_SERVICE;

    private final ControllerUtils CONTROLLER_UTILS;
    private final GlobalCookieUtils GLOBAL_COOKIE_UTILS;

    @Autowired
    public WorkoutsController(CustomerService customerService,
                              WorkoutTypeService workoutTypeService,
                              WorkoutService workoutService,

                              ControllerUtils controllerUtils,
                              GlobalCookieUtils globalCookieUtils) {
        this.CUSTOMER_SERVICE = customerService;
        this.WORKOUT_TYPE_SERVICE = workoutTypeService;
        this.WORKOUT_SERVICE = workoutService;

        this.CONTROLLER_UTILS = controllerUtils;
        this.GLOBAL_COOKIE_UTILS = globalCookieUtils;
    }

    @GetMapping
    public String showWorkoutsPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
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
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            WorkoutType workoutType = WORKOUT_TYPE_SERVICE.find(WorkoutTypes.RANDOM_WORDS);
            if (workoutType != null
                    && (workoutType.getActive() || CUSTOMER_SERVICE.isSuperUser(authCustomer))) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);
                request.setAttribute(WORKOUT_TYPE_ATTRIBUTE_NAME, workoutType);

                return Views.WORKOUTS_RANDOM_WORDS.PATH_TO_FILE;
            } else {
                return Redirects.WORKOUTS.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/collection_workout")
    public String showCollectionWorkoutPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            WorkoutType workoutType = WORKOUT_TYPE_SERVICE.find(WorkoutTypes.COLLECTION_WORKOUT);
            if (workoutType != null
                    && (workoutType.getActive() || CUSTOMER_SERVICE.isSuperUser(authCustomer))) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);
                request.setAttribute(WORKOUT_TYPE_ATTRIBUTE_NAME, workoutType);

                return Views.WORKOUTS_COLLECTION_WORKOUT.PATH_TO_FILE;
            } else {
                return Redirects.WORKOUTS.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/start")
    public String showStartPage(HttpServletRequest request, HttpServletResponse response) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            Workout workout = WORKOUT_SERVICE.findLastInactive(authCustomer.getId());
            if (workout != null) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);
                GLOBAL_COOKIE_UTILS.addCookieInHttpResponse
                        (response, GlobalCookies.WORKOUT_SECURITY_KEY, workout.getSecurityKey());

                return Views.WORKOUTS_START.PATH_TO_FILE;
            } else {
                return Redirects.WORKOUTS.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    // Нужно для тестирования + обновления кеша на странице тренировки
    /*@GetMapping("/start")
    public String showStartPage(HttpServletRequest request, HttpServletResponse response) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

            return Views.WORKOUTS_START.PATH_TO_FILE;
        } else {
            return Redirects.WORKOUTS.REDIRECT_URL;
        }
    }*/

    @GetMapping("/info/{id}")
    public String showWorkoutInfoOnePage(HttpServletRequest request,
                                         @PathVariable("id") Long id) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            Workout workout = WORKOUT_SERVICE.find(id);
            if (workout != null) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);
                request.setAttribute(WORKOUT_ID_ATTRIBUTE_NAME, id);

                return Views.WORKOUTS_SHOW_INFO_ONE.PATH_TO_FILE;
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }
}
