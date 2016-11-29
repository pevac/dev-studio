package com.devstudio.service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Vasyl on 22.11.2016.
 */
public interface GenericService<T,E>  {
    public List<T> findAll();
    @Transactional
    T create (T newInstance);
}
