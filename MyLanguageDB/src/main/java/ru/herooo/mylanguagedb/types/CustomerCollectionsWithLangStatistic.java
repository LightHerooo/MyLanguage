package ru.herooo.mylanguagedb.types;

import java.util.Optional;

public interface CustomerCollectionsWithLangStatistic {
    Optional<String> getLangCode();
    Optional<Long> getNumberOfCollections();
}
