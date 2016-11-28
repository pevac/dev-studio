package com.devstudio.restapi;

import com.devstudio.entity.CustomerRequest;
import com.devstudio.entity.Project;
import com.devstudio.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by sitis on 26.11.2016.
 */
@RestController("projectController")
@RequestMapping("/api/project")
public class ProjectController {

    @Autowired
    @Qualifier("projectService")
    ProjectService service;

    @RequestMapping(value = "/", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Project> postProject (@RequestBody Project project) {
        service.create(project);
        return new ResponseEntity<Project>(project, HttpStatus.CREATED);
    }



    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<List<Project>> getCustomerRequests(ModelMap model) {
        List<Project> list = service.findAll();
        return new ResponseEntity<List<Project>>(list, HttpStatus.OK);
    }
}
