package com.springapp.restapi;

import com.springapp.entities.CustomerRequest;
import com.springapp.repositories.model.service.CustomerRequestService;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.List;

@RestController
@RequestMapping("/api/customerrequest")
public class CustomerRequestController {
    List<CustomerRequest> list = null;

    @Inject
    CustomerRequestService service;

    @RequestMapping(value = "/1", method = RequestMethod.GET)
    public ResponseEntity<List<CustomerRequest>> getCustomerRequests(ModelMap model) {
        List<CustomerRequest> list = service.findAll();
        return new ResponseEntity<List<CustomerRequest>>(list, HttpStatus.OK);
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<CustomerRequest> postCustomerRequest(@RequestBody CustomerRequest customerRequest) {
        service.save(customerRequest);
        return new ResponseEntity<CustomerRequest>(customerRequest, HttpStatus.CREATED);
    }

    @InitBinder
    public void initBinder(WebDataBinder dataBinder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        dataBinder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }

}
