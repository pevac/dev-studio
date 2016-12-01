package com.devstudio.dao.impl;

import com.devstudio.dao.GenericDao;

import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

/**
 * Created by Vasya on 26.11.2016.
 */
@Repository
public abstract class GenericDaoImpl<T,E> implements GenericDao<T,E>{

    /**
     * By defining this class as abstract, we prevent Spring from creating
     * instance of this class
     */
    @PersistenceContext
    protected EntityManager em;
    Class<T> type;

    public GenericDaoImpl() {
        Type t = this.getClass().getGenericSuperclass();
        ParameterizedType pt = (ParameterizedType) t;
        this.type = (Class) pt.getActualTypeArguments()[0];
    }


    @Override
    public T create(final T newInstance) {
        this.em.persist(newInstance);
        return newInstance;
    }

    @Override
    public List<T> findAll() {
        final StringBuffer queryString = new StringBuffer(
                "SELECT o from ");
        queryString.append(type.getSimpleName()).append(" o ");
        TypedQuery<T> query = this.em.createQuery(queryString.toString(),  type);
        List<T> listOfObjects = query.getResultList();
        return listOfObjects;
    }
    @Override
    public T read(E key) {
        return this.em.find(this.type,key);
    }

    @Override
    public void update(T instance) {
        this.em.merge(instance);

    }

    @Override
    public void delete(T instance) {
        this.em.remove(instance);
    }





}
