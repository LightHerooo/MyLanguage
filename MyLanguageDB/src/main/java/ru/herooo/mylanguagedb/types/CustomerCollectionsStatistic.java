package ru.herooo.mylanguagedb.types;

import java.util.Optional;

public interface CustomerCollectionsStatistic {
    Optional<String> getLangCode();
    Optional<Long> getNumberOfCollections();
}
