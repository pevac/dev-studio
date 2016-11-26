package com.devstudio.repositories.model.dao;

import java.util.List;

/**
 * Created by Vasya on 26.11.2016.
 */
public interface GenericDao<T,E> {
    public T findByKey(T o, E key);
    public List<T> findAll();
    public void save (T o);
    public void update(T o);
    public void remove(T o);
}
