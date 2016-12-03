drop table customer_request;
drop table worker;
drop table project_list_url;
drop table vacancy;
drop table working_time;
drop table project; 
drop table job_position;
drop table company;
drop table company_comment;

create table company (
	id 			    	mediumint 	 not null auto_increment,
	date_regist     	datetime     not null default now(), 
	name_company    	varchar(255) not null,
	site_company_1  	varchar(255) not null,
    site_company_2  	varchar(255),
    site_company_3  	varchar(255),
	phone_1		    	varchar(255) not null,
    phone_2		    	varchar(255),
    phone_3		    	varchar(255),
	mail_1		    	varchar(255) not null,
    mail_2		    	varchar(255),
    mail_3		        varchar(255),
	primary key(id)
);

create table customer_request (
	id 			 mediumint 	  not null auto_increment,
	date_regist  datetime     not null default now(), 
	name_company varchar(255) not null,
	site_company varchar(255) not null,
	full_name    varchar(255) not null,
	phone		 varchar(255) not null,
	mail		 varchar(255) not null,
	job_position varchar(255) not null,
	q_client     varchar(255),
	q_busin_case varchar(255) not null,
	q_result     varchar(255),
	q_prototype  varchar(255) not null,
	status		 varchar(255) not null default 'new',
    company_id   mediumint,
	primary key (id),
    foreign key (company_id) references company(id)
);

create table worker (
	id 			 mediumint 	  not null auto_increment,
	date_regist  datetime     not null default now(), 
	name_company varchar(255) not null,
	site_company varchar(255) not null,
	first_name   varchar(255) not null,
    last_name	 varchar(255) not null,
	phone_1		 varchar(255) not null,
    phone_2		 varchar(255),
    phone_3		 varchar(255),
	mail_1		 varchar(255) not null,
    mail_2		 varchar(255),
    mail_3		 varchar(255),
    company_id 	 mediumint,
	primary key(id),
	foreign key(company_id) references company(id)
);

create table project (
	id 			     mediumint     not null auto_increment,
    date_regist      datetime      not null default now(),
    project_name     varchar(255)  not null,
    description      varchar(2000)  not null,
    foto_main_url    varchar(255)  not null,
    site_main_url    varchar(255),
    show_status   	 boolean 	   default  false,
    show_arhive   	 boolean	   default  false, 
    priority	  	 mediumint     not null default 1,
    company_id 	  	 mediumint,
    primary key (id),
    foreign key (company_id) references company(id)
);

create table project_list_url (
	id 			  mediumint    not null auto_increment,
    date_regist   datetime     not null default now(),
    project_id    mediumint    not null,
    link_url      varchar(255) not null,
    type_data_url varchar(255) not null,
    primary key (id),
    foreign key(project_id) references project(id)
);

create table job_position (
	id 		 mediumint not null auto_increment,
    job_name varchar(255) not null,
    primary key (id)
);

create table working_time  (
	id mediumint not null auto_increment,
    busy_hour varchar(255) not null,
    primary key(id)
);

create table vacancy (
	id 			    mediumint 	  not null auto_increment,
	date_regist     datetime      not null default now(),
    job_position_id mediumint 	  not null,
    project_id 		mediumint 	  not null,
    description	    varchar(2000)  not null,
    working_time_id mediumint 	  not null,
    add_description varchar(2000)  not null,
    show_status     boolean       default false,
    active_satatus  boolean 	  default false,
    foreign key (working_time_id) references working_time(id),
    foreign key (project_id) 	  references project(id),
    foreign key (job_position_id) references job_position(id),
    primary key (id)
);

create table company_comment (
    id 			 mediumint     not null auto_increment,
	date_regist  datetime      not null default now(),
    project_name varchar(255)  not null,
	description	 varchar(255)  not null,
    comment      varchar(2000) not null,
    show_status  boolean       default false,
    primary key (id)
)


