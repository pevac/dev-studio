package com.devstudio.clienttest;

//import com.devstudio.entity.AdvList;
//import com.devstudio.entity.Advertisement;
import com.devstudio.entity.CustomerRequest;
import com.devstudio.entity.Project;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

public class Maintest {
    public static void main(String[] args) {
        try {
            CustomerRequest customerRequest = new CustomerRequest();
            customerRequest.setFull_name("fgjhsdfasd");
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