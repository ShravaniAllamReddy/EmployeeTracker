DROP DATABASE IF EXISTS employee_DB;

CREATE DATABASE employee_DB;

USE employee_DB;


CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  SALARY DECIMAL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES  role (id)
  -- FOREIGN KEY (manager_id) REFERENCES  employee (id)
);



INSERT INTO department(name)
VALUES("Engineering"),("HR");

INSERT INTO role( title, salary, department_id)
VALUES("Software Developer", 3200.00, 1),("Intern", 2300.00, 2);

INSERT INTO employee ( first_name, last_name, role_id, manager_id)
VALUES("shravani", "allam", 1, 23 ),("sweety", "allam", 2, 34);

select * from employee;

select * from department;

select * from role;

SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department , r.salary, e.manager_id
FROM 
employee AS e
join role AS r
on  e.role_id = r.id
join department as d 
on r.department_id = d.id;

SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department , r.salary, e.manager_id
FROM 
employee AS e
join role AS r
on  e.role_id = r.id
join department as d 
on r.department_id = d.id
where d.name = "Engineering";
