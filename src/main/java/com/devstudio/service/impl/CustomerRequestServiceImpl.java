package com.devstudio.service.impl;

import java.util.List;

import com.devstudio.dao.GenericDao;

import com.devstudio.entity.CustomerRequest;
import com.devstudio.dao.CustomerRequestDao;
import com.devstudio.service.CustomerRequestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service("customerRequestService")
public class CustomerRequestServiceImpl extends GenericServiceImpl<CustomerRequest,Integer> implements CustomerRequestService {
  
	private CustomerRequestDao customerRequestDao;

    public CustomerRequestServiceImpl(){

    }
    @Autowired
    public CustomerRequestServiceImpl(@Qualifier("customerRequestDao")GenericDao<CustomerRequest,Integer> genericDao){
        super(genericDao);
        this.customerRequestDao=(CustomerRequestDao) genericDao;

    }




    
}

