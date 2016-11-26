package com.springapp.repositories.model.dao;


import com.springapp.entities.Project;

import java.lang.ref.PhantomReference;
import java.util.List;

public interface ProjectDao {

    Project findById(int id);
    List<Project> findAll();
    void save(Project project);
    void delete(Project project);

}
