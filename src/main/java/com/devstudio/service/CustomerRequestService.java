package com.devstudio.repositories.model.service;

import java.util.List;

import com.devstudio.entities.CustomerRequest;

public interface CustomerRequestService {
	 CustomerRequest findById(int id);
	 List<CustomerRequest> findAll();
	 void save(CustomerRequest link);
	 void remove(CustomerRequest link);
}
