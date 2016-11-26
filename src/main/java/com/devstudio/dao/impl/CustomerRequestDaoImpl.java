package com.devstudio.dao.impl;

import com.devstudio.entity.CustomerRequest;
import com.devstudio.dao.CustomerRequestDao;
import org.springframework.stereotype.Repository;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

@Repository
public class CustomerRequestDaoImpl implements CustomerRequestDao {
    @PersistenceContext
    private EntityManager em;
    
    public CustomerRequest findById(int id){
    	return em.find(CustomerRequest.class, id);
    }

    public void save(CustomerRequest customerRequest){
    	if (customerRequest.getId() == 0){
    		em.persist(customerRequest);
    	} else{
    		em.merge(customerRequest);
    	}
    }
    
    public void remove(int id){
    	CustomerRequest customerRequest = em.find(CustomerRequest.class, id);
    	if (customerRequest != null){
    		em.remove(customerRequest);
    	}
    }
    
    
    public List<CustomerRequest> findAll(){
        TypedQuery<CustomerRequest> query = em.createQuery("SELECT m FROM CustomerRequest m",  CustomerRequest.class);
        List<CustomerRequest> listM = query.getResultList();
        return listM; 
    }


	
	public void remove(CustomerRequest customerRequest) {
		em.remove(findById(customerRequest.getId()));
	}


}
