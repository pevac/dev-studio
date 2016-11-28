package com.devstudio.dao.impl;

import com.devstudio.entity.CustomerRequest;
import com.devstudio.dao.CustomerRequestDao;
import org.springframework.stereotype.Repository;

import java.util.List;



@Repository("customerRequestDao")
public class CustomerRequestDaoImpl extends GenericDaoImpl<CustomerRequest,Integer> implements CustomerRequestDao {



}
