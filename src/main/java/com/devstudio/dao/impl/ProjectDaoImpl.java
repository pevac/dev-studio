package com.devstudio.dao.impl;


import com.devstudio.dao.ProjectDao;
import com.devstudio.entity.Project;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Repository("projectDao")
public class ProjectDaoImpl extends GenericDaoImpl<Project,Integer> implements ProjectDao{



}
