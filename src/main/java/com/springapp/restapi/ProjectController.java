package com.springapp.restapi;


import com.springapp.entities.Project;
import com.springapp.repositories.model.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.inject.Inject;
import java.util.List;

@RestController
@RequestMapping ("/api/project")
public class ProjectController {

    private List<Project> list = null;

    @Inject
    ProjectService service;

    @RequestMapping(value = "/1", method = RequestMethod.GET)
    public ResponseEntity<List<Project>> getProject (ModelMap model) {
        List<Project> list = service.findAll();
        return new ResponseEntity<List<Project>>(list, HttpStatus.OK);
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Project> postProject (@RequestBody Project project) {
        service.save(project);
        return new ResponseEntity<Project>(project, HttpStatus.CREATED);
    }

}
