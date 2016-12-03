package com.devstudio.service.impl;

import com.devstudio.dao.GenericDao;
import com.devstudio.service.GenericService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Vasyl on 28.11.2016.
 */
@Service
public abstract class GenericServiceImpl<T,E> implements GenericService<T,E> {




    private GenericDao<T,E> genericDao;
    public GenericServiceImpl(GenericDao<T,E> genericDao) {
        this.genericDao=genericDao;
    }

    public GenericServiceImpl() {
    }

    public List<T> findAll(){
        return genericDao.findAll();
    }

    public T create(final T newInstance){

        return genericDao.create(newInstance);
    }

    public T read(final E key){
        return genericDao.read(key);
    }

    public void update(T instance){
        genericDao.update(instance);
    }

    public void delete(T instance) {
        genericDao.delete(instance);
    }


}
