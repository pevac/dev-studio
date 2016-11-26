package com.devstudio.repositories.model.dao;

import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 * Created by Vasya on 26.11.2016.
 */
@Repository
public class GenericDaoImpl<T,E> implements GenericDao<T,E> {
    @PersistenceContext
    EntityManager em;
    @Override
    public T findBykey(T o, E key) {
        return null;
    }

    @Override
    public List<T> findAll() {
        return null;
    }

    @Override
    public void save(T o) {
        if((T.getId())==null)
            em.persist(o);
        else
            em.merge(o);

    }

    @Override
    public void update(T o) {

    }

    @Override
    public void remove(T o) {
        if((T.getId)!=null)
            em.remove(o);
    }
}
