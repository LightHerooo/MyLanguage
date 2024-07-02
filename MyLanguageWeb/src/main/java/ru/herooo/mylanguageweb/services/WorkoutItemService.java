package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WordInCollection;
import ru.herooo.mylanguagedb.entities.WorkoutItem;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguagedb.entities.word.Word;
import ru.herooo.mylanguagedb.entities.workout.Workout;
import ru.herooo.mylanguagedb.repositories.WorkoutCrudRepository;
import ru.herooo.mylanguagedb.repositories.WorkoutItemCrudRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkoutItemService {
    private final WorkoutItemCrudRepository WORKOUT_ITEM_CRUD_REPOSITORY;
    private final WorkoutCrudRepository WORKOUT_CRUD_REPOSITORY;

    @Autowired
    public WorkoutItemService(WorkoutItemCrudRepository workoutItemCrudRepository,
                              WorkoutCrudRepository workoutCrudRepository) {
        this.WORKOUT_ITEM_CRUD_REPOSITORY = workoutItemCrudRepository;
        this.WORKOUT_CRUD_REPOSITORY = workoutCrudRepository;
    }

    public List<WorkoutItem> findAll(Long workoutId, Boolean isQuestionWithAnswer, Integer roundNumber) {
        return WORKOUT_ITEM_CRUD_REPOSITORY.findAll(workoutId, isQuestionWithAnswer, roundNumber);
    }

    public WorkoutItem add(WorkoutItem workoutItem) {
        workoutItem.setCorrect(false);
        workoutItem.setAnswer(null);
        workoutItem.setDateOfSetAnswer(null);
        if (workoutItem.getRoundNumber() <= 0) {
            workoutItem.setRoundNumber(1);
        }

        return WORKOUT_ITEM_CRUD_REPOSITORY.save(workoutItem);
    }

    public WorkoutItem add(Workout workout, Word word) {
        WorkoutItem workoutItem = null;

        if (workout != null && word != null) {
            workoutItem = new WorkoutItem();
            workoutItem.setWorkout(workout);
            workoutItem.setQuestion(word.getTitle());

            workoutItem = add(workoutItem);
        }

        return workoutItem;
    }

    public WorkoutItem add(Workout workout, WordInCollection wordInCollection) {
        WorkoutItem workoutItem = null;

        if (workout != null && wordInCollection != null) {
            Word word = wordInCollection.getWord();
            if (word != null) {
                workoutItem = this.add(workout, word);
            }
        }

        return workoutItem;
    }

    public WorkoutItem copyToNextRound(WorkoutItem workoutItem) {
        WorkoutItem workoutItemToNextRound = null;

        if (workoutItem != null) {
            workoutItemToNextRound = new WorkoutItem();
            workoutItemToNextRound.setWorkout(workoutItem.getWorkout());
            workoutItemToNextRound.setQuestion(workoutItem.getQuestion());
            workoutItemToNextRound.setRoundNumber(workoutItem.getRoundNumber() + 1);
            workoutItemToNextRound = this.add(workoutItemToNextRound);
        }

        return workoutItemToNextRound;
    }

    public WorkoutItem setAnswer(WorkoutItem workoutItem, String answer, Boolean isCorrect) {
        workoutItem.setAnswer(answer);
        workoutItem.setCorrect(isCorrect);
        workoutItem.setDateOfSetAnswer(LocalDateTime.now());
        return WORKOUT_ITEM_CRUD_REPOSITORY.save(workoutItem);
    }

    public WorkoutItem find(long id) {
        return WORKOUT_ITEM_CRUD_REPOSITORY.findById(id).orElse(null);
    }

    public WorkoutItem findRandomWithoutAnswer(Long workoutId, Integer roundNumber) {
        return WORKOUT_ITEM_CRUD_REPOSITORY
                .findRandomWithoutAnswer(workoutId, roundNumber).orElse(null);
    }

    public WorkoutItem findFirstWithoutAnswer(Long workoutId, Integer roundNumber) {
        return WORKOUT_ITEM_CRUD_REPOSITORY.findFirstWithoutAnswer(workoutId, roundNumber).orElse(null);
    }



    public long count(Long workoutId, Boolean isQuestionWithAnswer, Integer roundNumber) {
        return WORKOUT_ITEM_CRUD_REPOSITORY.count(workoutId, isQuestionWithAnswer, roundNumber).orElse(0L);
    }

    public boolean addByWords(Workout workout, List<Word> words) {
        boolean areItemsCreated = false;

        if (workout != null) {
            if (words != null && words.size() > 0) {
                for (Word word: words) {
                    areItemsCreated = add(workout, word) != null;
                    if (!areItemsCreated) {
                        break;
                    }
                }
            }

            if (!areItemsCreated) {
                WORKOUT_CRUD_REPOSITORY.delete(workout);;
            }
        }

        return areItemsCreated;
    }

    public boolean addByWordsInCollection(Workout workout, List<WordInCollection> wordsInCollection) {
        boolean areItemsCreated = false;

        if (workout != null) {
            if (wordsInCollection != null && wordsInCollection.size() > 0) {
                for (WordInCollection wordInCollection: wordsInCollection) {
                    areItemsCreated = add(workout, wordInCollection) != null;
                    if (!areItemsCreated) {
                        break;
                    }
                }
            }

            if (!areItemsCreated) {
                WORKOUT_CRUD_REPOSITORY.delete(workout);
            }
        }

        return areItemsCreated;
    }
}
