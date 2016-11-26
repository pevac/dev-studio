package com.devstudio.repositories.model.dao;


import com.devstudio.entities.Project;

import java.util.List;

public interface ProjectDao {

    Project findById(int id);
    List<Project> findAll();
    void save(Project project);
    void delete(Project project);

}
