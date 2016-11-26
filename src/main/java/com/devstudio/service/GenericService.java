package com.devstudio.service;

import java.util.List;

/**
 * Created by Vasyl on 22.11.2016.
 */
public interface GenericService<T,E>  {
    abstract T findById(int id);
    abstract List<T> findAll();
    abstract void save(T link);
    abstract void remove(T link);
}
