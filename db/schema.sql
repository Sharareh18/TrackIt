DROP DATABASE IF EXISTS business_db;
CREATE database business_db;

USE business_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,   
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id));

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL 
    -- UNSIGNED DEFAULT 1.00,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY (id));

CREATE TABLE employee (
    id int not null auto_increment,
    first_name varchar(30)not null,
    last_name varchar(30)not null,
    role_id int references role(id),
    manager_id int references manager(id),
    PRIMARY key (id));
   