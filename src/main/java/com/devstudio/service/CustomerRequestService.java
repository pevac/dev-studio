package com.devstudio.service;

import java.util.List;

import com.devstudio.entity.CustomerRequest;

public interface CustomerRequestService {
	 CustomerRequest findById(int id);
	 List<CustomerRequest> findAll();
	 void save(CustomerRequest link);
	 void remove(CustomerRequest link);
}
