package com.devstudio.service.impl;

import java.util.List;
import javax.inject.Inject;
import javax.inject.Named;

import com.devstudio.entity.CustomerRequest;
import com.devstudio.dao.CustomerRequestDao;
import com.devstudio.service.CustomerRequestService;
import org.springframework.transaction.annotation.Transactional;


@Named
public class CustomerRequestServiceImpl implements CustomerRequestService {
  
	@Inject
    private CustomerRequestDao customerRequestDao;
    
    public CustomerRequest findById(int id) {
    	return customerRequestDao.findById(id);
    } 
   
    
    public List<CustomerRequest> findAll(){
    	return customerRequestDao.findAll();
    }
    
    @Transactional
    public void save(CustomerRequest customerRequest){
      	customerRequestDao.save(customerRequest);
    }

    @Transactional
	public void remove(CustomerRequest customerRequest) {
		customerRequestDao.remove(customerRequest);
	}



    
}

