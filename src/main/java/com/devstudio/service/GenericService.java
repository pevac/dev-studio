package com.devstudio.repositories.model.service;

import java.util.List;

/**
 * Created by Vasyl on 22.11.2016.
 */
abstract public class AbstractService<T> {
    abstract T findById(int id);
    abstract List<T> findAll();
    abstract void save(T link);
    abstract void remove(T link);
}
