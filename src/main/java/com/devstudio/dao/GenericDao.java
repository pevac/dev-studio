package com.devstudio.dao;

import com.devstudio.entity.GenericEntity;

import java.util.List;

/**
 * Created by Vasya on 26.11.2016.
 */
public interface GenericDao<T,E> {
   /* public T findByKey(T o, E key);
    public List<T> findAll();*/
    public T create (T newInstance);
    public T read(E id);
    public void update(T instance);
    public void delete(T instance);
}
