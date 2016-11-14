package com.springapp.restapi;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.List;
import javax.inject.Inject;
import javax.validation.Valid;

import com.springapp.entities.CustomerRequest;
import com.springapp.repositories.model.service.CustomerRequestService;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customerrequest")
public class CustomerRequestController {
	List<CustomerRequest> list = null;

	@Inject
	CustomerRequestService service;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<CustomerRequest> getCustomerRequests(ModelMap model) {
		List<CustomerRequest> list = service.findAll();
		return list;
	}


	@RequestMapping(value = "/", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<CustomerRequest> postCustomerRequest(@RequestBody CustomerRequest customerRequest) {
		service.save(customerRequest);
		return new ResponseEntity<CustomerRequest> (customerRequest, HttpStatus.CREATED);

	}

	

	@InitBinder
	public void initBinder(WebDataBinder dataBinder) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		dataBinder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
	}

}
