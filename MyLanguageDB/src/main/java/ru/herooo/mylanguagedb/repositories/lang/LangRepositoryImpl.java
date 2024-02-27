package ru.herooo.mylanguagedb.repositories.lang;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ru.herooo.mylanguagedb.entities.Lang;

import java.util.Optional;

public class LangRepositoryImpl implements LangRepository<Lang> {

    @PersistenceContext
    private EntityManager em;


    @Override
    public Optional<Lang> find(Langs langs) {
        return em.createQuery("from Lang l where l.id = :lang_id", Lang.class)
                .setParameter("lang_id", langs.getId())
                .getResultStream().findAny();
    }
}
