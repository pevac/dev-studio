package com.springapp.clienttest;

//import com.springapp.entities.AdvList;
//import com.springapp.entities.Advertisement;
import com.springapp.entities.CustomerRequest;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Maintest {
    public static void main(String[] args) {
        try {
            CustomerRequest customerRequest = new CustomerRequest();
            customerRequest.setFull_name("Ivamov");
            String url = "http://localhost:8080/api/customerrequest/";
            RestTemplate restTemplate = new RestTemplate();
            restTemplate.postForObject(url, customerRequest, CustomerRequest.class);
        } catch (RestClientException e) {
            e.printStackTrace();
        }


//        AdvList listObj = new RestTemplate().
//                getForObject("http://localhost:8080/lxml", AdvList.class);
//        List<Advertisement> list = listObj.getAdvList();
//        for (Advertisement m : list) {
//            System.out.println(m.getName());
//        }

//        Advertisement advertisement = new RestTemplate().
//                getForObject("http://localhost:8080/lxml/2", Advertisement.class);
//        System.out.println("===== Advertisement Info =====");
//        System.out.println(advertisement);
//
//        try {
//            String url =
//                    "http://localhost:8080/lxml/upd/{id}";
//            Map<String, String> params = new HashMap<String, String>();
//            params.put("id", Long.toString(advertisement.getId()));
//
//            RestTemplate restTemplate = new RestTemplate();
//            advertisement.setName("new name tratata");
//            restTemplate.put(url, advertisement, params);
//        } catch (RestClientException e) {
//            e.printStackTrace();
//        }
//
//
    }

}