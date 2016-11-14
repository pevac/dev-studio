package com.springapp.repositories.model.dao;

import com.springapp.entities.CustomerRequest;

import java.util.List;

public interface CustomerRequestDao {
	 CustomerRequest findById(int id);
	 List<CustomerRequest> findAll();
	 void save(CustomerRequest link);
	 void remove(CustomerRequest link);
}
