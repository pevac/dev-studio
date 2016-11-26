package com.springapp.repositories.model.service;

import com.springapp.entities.Project;

import java.util.List;

public interface ProjectService {

    Project findById(int id);
    List<Project> findAll();
    void save(Project project);
    void delete(Project project);

}
