package com.springapp.repositories.model.service;

import java.util.List;

import com.springapp.entities.CustomerRequest;

public interface CustomerRequestService {
	 CustomerRequest findById(int id);
	 List<CustomerRequest> findAll();
	 void save(CustomerRequest link);
	 void remove(CustomerRequest link);
}
