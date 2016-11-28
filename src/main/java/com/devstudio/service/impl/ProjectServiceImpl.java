package com.devstudio.service.impl;


import com.devstudio.dao.GenericDao;
import com.devstudio.service.ProjectService;
import com.devstudio.entity.Project;
import com.devstudio.dao.ProjectDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import java.util.List;

@Service("projectService")
public class ProjectServiceImpl extends GenericServiceImpl<Project,Integer> implements ProjectService {

    private ProjectDao projectDao;
    public ProjectServiceImpl(){

    }
    @Autowired
    public ProjectServiceImpl(@Qualifier("projectDao") GenericDao<Project, Integer> genericDao) {
        super(genericDao);
        this.projectDao = (ProjectDao) genericDao;
    }

}