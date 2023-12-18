package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.repositories.WordCrudRepository;
import ru.herooo.mylanguageweb.controllers.rest.LangsRestController;
import ru.herooo.mylanguageweb.controllers.rest.PartsOfSpeechRestController;
import ru.herooo.mylanguageweb.controllers.rest.WordStatusesRestController;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;

import java.util.List;

@Service
public class WordService {
    private final WordStatusesRestController WORD_STATUSES_REST_CONTROLLER;
    private final PartsOfSpeechRestController PARTS_OF_SPEECH_REST_CONTROLLER;
    private final LangsRestController LANGS_REST_CONTROLLER;

    private final WordCrudRepository WORD_CRUD_REPOSITORY;

    @Autowired
    public WordService(WordStatusesRestController wordStatusesRestController,
                               PartsOfSpeechRestController partsOfSpeechRestController,
                               LangsRestController langsRestController,
                               WordCrudRepository wordCrudRepository) {
        this.WORD_STATUSES_REST_CONTROLLER = wordStatusesRestController;
        this.PARTS_OF_SPEECH_REST_CONTROLLER = partsOfSpeechRestController;
        this.LANGS_REST_CONTROLLER = langsRestController;
        this.WORD_CRUD_REPOSITORY = wordCrudRepository;
    }

    // Получение всех слов
    public List<Word> findAll() {
        return WORD_CRUD_REPOSITORY.findAll();
    }

    // Проверка введённых параметров для сортировки, возвращение ответа
    private ResponseEntity<?> getResponseAfterValidateParametersForFilter(
            String wordStatusCode,
            String partOfSpeechCode,
            String langCode) {
        if (wordStatusCode != null) {
            ResponseEntity<?> response = WORD_STATUSES_REST_CONTROLLER.findByCode(wordStatusCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        if (partOfSpeechCode != null) {
            ResponseEntity<?> response = PARTS_OF_SPEECH_REST_CONTROLLER.findByCode(partOfSpeechCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        if (langCode != null) {
            ResponseEntity<?> response = LANGS_REST_CONTROLLER.findByCode(langCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        CustomResponseMessage message = new CustomResponseMessage(1,
                "Введённые параметры корректны и подходят для сортировки.");
        return ResponseEntity.ok(message);
    }


    // Получение ответа после сортировки слов (список / ошибка)
    public ResponseEntity<?> getResponseAfterFilter(
            String title,
            String wordStatusCode,
            String partOfSpeechCode,
            String langCode) {

        ResponseEntity<?> responseAfterValidateParametersForFilter =
                getResponseAfterValidateParametersForFilter(wordStatusCode, partOfSpeechCode, langCode);
        if (responseAfterValidateParametersForFilter.getStatusCode() != HttpStatus.OK) {
            return responseAfterValidateParametersForFilter;
        }

        List<Word> wordsAfterFilter = WORD_CRUD_REPOSITORY
                .findAfterFilter(title, wordStatusCode, partOfSpeechCode, langCode);
        if (wordsAfterFilter != null && wordsAfterFilter.size() > 0) {
            return ResponseEntity.ok(wordsAfterFilter);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Слова по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    // Получение ответа после сортировки слов с пагинацией (список / ошибка)
    public ResponseEntity<?> getResponseAfterFilterWithPagination(
            String title,
            String wordStatusCode,
            String partOfSpeechCode,
            String langCode,
            Long numberOfWordsOnPage,
            Long lastWordIdOnPreviousPage) {

        ResponseEntity<?> responseAfterValidateParametersForFilter =
                getResponseAfterValidateParametersForFilter(wordStatusCode, partOfSpeechCode, langCode);
        if (responseAfterValidateParametersForFilter.getStatusCode() != HttpStatus.OK) {
            return responseAfterValidateParametersForFilter;
        }

        if (numberOfWordsOnPage == null || numberOfWordsOnPage <= 0) {
            CustomResponseMessage message =
                    new CustomResponseMessage(1, "Количество слов должно быть больше 0.");
            return ResponseEntity.badRequest().body(message);
        }


        if (lastWordIdOnPreviousPage == null || lastWordIdOnPreviousPage < 0) {
            CustomResponseMessage message =
                    new CustomResponseMessage(2,
                            "ID последнего слова на предыдущей странице не должен быть отрицательным. " +
                                    "Если вы хотите отобразить первую страницу, укажите ID = 0.");
            return ResponseEntity.badRequest().body(message);
        }

        List<Word> wordsAfterFilerWithPagination =
                WORD_CRUD_REPOSITORY.findAfterFilterWithPagination(title, wordStatusCode, partOfSpeechCode,
                        langCode, numberOfWordsOnPage, lastWordIdOnPreviousPage);
        if (wordsAfterFilerWithPagination != null && wordsAfterFilerWithPagination.size() > 0) {
            return ResponseEntity.ok(wordsAfterFilerWithPagination);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(3, "Слова по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    public long getNumberOfWords() {
        return WORD_CRUD_REPOSITORY.count();
    }
}
