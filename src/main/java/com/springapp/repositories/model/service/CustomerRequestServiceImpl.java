package com.springapp.repositories.model.service;

import java.io.IOException;
import java.util.List;
import javax.inject.Inject;
import javax.inject.Named;

import com.springapp.entities.CustomerRequest;
import com.springapp.repositories.model.dao.CustomerRequestDao;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;




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

