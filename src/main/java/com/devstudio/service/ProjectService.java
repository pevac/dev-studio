package com.devstudio.service;

import com.devstudio.entity.Project;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProjectService extends GenericService<Project,Integer> {

   /* @Transactional
    Project create(Project project);

    List<Project> findAll();*/
}
