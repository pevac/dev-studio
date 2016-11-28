package com.devstudio.dao.impl;

import com.devstudio.dao.GenericDao;
import com.devstudio.entity.GenericEntity;
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
        Type t = getClass().getGenericSuperclass();
        ParameterizedType pt = (ParameterizedType) t;
        type = (Class) pt.getActualTypeArguments()[0];
    }


    @Override
    public T create(final T newInstance) {
        this.em.persist(newInstance);
        return newInstance;
    }

    public List<T> findAll() {
        final StringBuffer queryString = new StringBuffer(
                "SELECT o from ");
        queryString.append(type.getSimpleName()).append(" o ");
        TypedQuery<T> query = this.em.createQuery(queryString.toString(),  type);
        List<T> listOfObjects = query.getResultList();
        return listOfObjects;
    }
//    @Override
//    public T read(E id) {
//        return null;
//    }
//
//    @Override
//    public void update(T instance) {
//
//    }
//
//    @Override
//    public void delete(T instance) {
//
//    }




    /*@Override
    public T findByKey(T o, E key) {
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
    }*/
}
