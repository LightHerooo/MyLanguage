package ru.herooo.mylanguagedb.entities.customer_collection.types;

import java.util.Optional;

public interface CustomerCollectionsStatistic {
    Optional<String> getLangCode();
    Optional<Long> getNumberOfCollections();
}
